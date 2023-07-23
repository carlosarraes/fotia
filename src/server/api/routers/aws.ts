import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { env } from '@/env.mjs'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import type { PutObjectCommandInput } from '@aws-sdk/client-s3'
import { s3 } from '@/utils/s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getAllUserImgs } from '@/utils/getAllImgs'

export const awsRouter = createTRPCRouter({
  uploadImgs: protectedProcedure
    .input(
      z.object({
        images: z.array(
          z.object({
            id: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx: { session }, input: { images } }) => {
      const putCommands: Array<PutObjectCommand> = images.map(({ id }) => {
        const Key = `fotia/${session.user.id}/${id}.jpeg`

        const commandInput: PutObjectCommandInput = {
          Bucket: env.AWS_BUCKET_NAME,
          Key,
          ContentType: 'image/jpeg',
        }

        return new PutObjectCommand(commandInput)
      })

      const signedUrls = await Promise.all(
        putCommands.map((command) =>
          getSignedUrl(s3, command, {
            expiresIn: 120,
          }),
        ),
      )

      return signedUrls
    }),
  getAllImgs: protectedProcedure.query(async ({ ctx: { session, prisma } }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        modelDoneTraining: true,
      },
    })

    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    const modelDoneTraining = (user?.modelDoneTraining as boolean | undefined) || false

    return await getAllUserImgs(session.user.id, modelDoneTraining)
  }),
  deleteImg: protectedProcedure
    .input(
      z.object({
        key: z.string(),
      }),
    )
    .mutation(async ({ input: { key } }) => {
      const Key = `fotia/clk8cqa8p0000sb7zbxe4pwgv/${key}`
      const deleteObjectCommand = new DeleteObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key,
      })
      try {
        console.log('deleteObjectCommand', deleteObjectCommand)
        await s3.send(deleteObjectCommand)
      } catch (error) {
        console.log(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while deleting the image',
        })
      }
    }),
})

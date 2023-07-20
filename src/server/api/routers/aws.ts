import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { env } from '@/env.mjs'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import {
  PutObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import type { PutObjectCommandInput } from '@aws-sdk/client-s3'
import { s3 } from '@/utils/s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const getAllUserImgs = async (userId: string) => {
  const path = `fotia/${userId}/`

  const { Contents } = await s3.send(
    new ListObjectsV2Command({
      Bucket: env.AWS_BUCKET_NAME,
      Prefix: path,
    }),
  )

  if (!Contents) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'No images found',
    })
  }

  const objCommands = Contents.map(({ Key }) => {
    return new GetObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: Key as string,
    })
  })

  const signedUrls = await Promise.all(
    objCommands.map((command) =>
      getSignedUrl(s3, command, {
        expiresIn: 120,
      }),
    ),
  )

  const signedUrlsWithKeys = signedUrls.map((url, i) => {
    if (!Contents[i]) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No images found',
      })
    }

    const key = Contents[i]?.Key
    if (!key) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No images found',
      })
    }

    const id = key.split('/')[2]
    if (!id) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No images found',
      })
    }

    return {
      url,
      key,
      id,
    }
  })

  return signedUrlsWithKeys
}

const awsRouter = createTRPCRouter({
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
  getAllImgs: protectedProcedure.query(async ({ ctx: { session } }) => {
    return await getAllUserImgs(session.user.id)
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

export default awsRouter

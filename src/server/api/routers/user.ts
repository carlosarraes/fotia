import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'
import { s3 } from '@/utils/s3'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import axios from 'axios'
import { env } from '@/env.mjs'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { GetObjectCommand } from '@aws-sdk/client-s3'

type ApiResponse = {
  data: {
    id: string
    status: string
  }
}

export const userRouter = createTRPCRouter({
  fetchUser: protectedProcedure.query(async ({ ctx: { prisma, session } }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        isPaymentSucceeded: true,
        credits: true,
        images: true,
        uniqueKeyword: true,
      },
    })

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      })
    }

    return user
  }),
  updateReadyToTrain: protectedProcedure.mutation(async ({ ctx: { prisma, session } }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    })

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      })
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        modelReadyToTrain: true,
      },
    })
  }),
  getReadyToTrain: protectedProcedure.query(async ({ ctx: { prisma, session } }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    })

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      })
    }

    return user.modelReadyToTrain as boolean
  }),
  trainModel: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
      }),
    )
    .mutation(async ({ ctx: { prisma, session }, input: { prompt } }) => {
      const user = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      })

      if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      if (!user.isPaymentSucceeded)
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Payment not succeeded' })
      if (user.modelTrainingLimit === 0)
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Model training limit reached' })

      try {
        const zipData = await getSignedUrl(
          s3,
          new GetObjectCommand({
            Bucket: env.AWS_BUCKET_NAME,
            Key: `fotia/${session.user.id}/data.zip`,
          }),
          {
            expiresIn: 3600,
          },
        )

        const uniqueKeyword = `${nanoid(3)}person`

        if (!prompt.match(/KEYPERSON/gi))
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Prompt não inclui KEYPERSON' })
        if (prompt.length < 20)
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Prompt muito pequeno, de mais detalhes',
          })

        prompt = prompt.replace(/KEYPERSON/gi, uniqueKeyword)

        const response: ApiResponse = await axios.post(
          'https://api.runpod.ai/v2/dream-booth-v1/run',
          {
            input: {
              train: {
                concept_name: uniqueKeyword,
                data_url: zipData,
                unet_epochs: 120,
                text_steps: 1200,
                unet_resolution: 1024,
                text_learning_rate: 5e-6,
                unet_learning_rate: 5e-6,
                text_lr_scheduler: 'polynomial',
                unet_lr_scheduler: 'polynomial',
              },
              inference: [
                {
                  prompt,
                  negative_prompt:
                    'blurry, side looking, duplication, lowres, cropped, worst quality, low quality, jpeg artifacts, out of frame, watermark, signature',
                  sampler_name: 'LMS',
                  batch_size: 30,
                  steps: 100,
                  cfg_scale: 7,
                },
              ],
            },
            s3Config: {
              bucketName: env.AWS_BUCKET_NAME,
              accessId: env.AWS_ACCESS_KEY,
              accessSecret: env.AWS_SECRET_KEY,
              endpointUrl: `https://s3.sa-east-1.amazonaws.com/arrais`,
            },
            webhook: `${env.WEBHOOK}?userId=${session.user.id}`,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: env.RUNPOD_KEY,
            },
          },
        )

        await prisma.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            modelId: response.data.id,
            modelTrainingLimit: {
              decrement: 1,
            },
            modelTrained: true,
            uniqueKeyword,
          },
        })
      } catch (error) {
        if (error instanceof TRPCError) {
          console.log(error.message)
          throw new TRPCError({ code: 'BAD_REQUEST', message: error.message })
        }
      }
    }),
  getModelTrained: protectedProcedure.query(async ({ ctx: { prisma, session } }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    })

    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

    return {
      modelTrained: user.modelTrained as boolean,
      modelDoneTraining: user.modelDoneTraining as boolean,
    }
  }),
})

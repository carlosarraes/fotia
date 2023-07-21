import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'

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
})

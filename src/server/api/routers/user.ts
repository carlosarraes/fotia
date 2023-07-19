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
})

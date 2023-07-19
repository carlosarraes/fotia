import { createTRPCRouter } from '@/server/api/trpc'
import { stripeRouter, userRouter } from './routers'

export const appRouter = createTRPCRouter({
  stripe: stripeRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter

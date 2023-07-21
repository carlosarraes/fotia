import { createTRPCRouter } from '@/server/api/trpc'
import { stripeRouter, userRouter, awsRouter, imageRouter } from './routers'

export const appRouter = createTRPCRouter({
  stripe: stripeRouter,
  user: userRouter,
  aws: awsRouter,
  image: imageRouter,
})

export type AppRouter = typeof appRouter

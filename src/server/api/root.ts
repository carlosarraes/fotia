import { createTRPCRouter } from '@/server/api/trpc'
import { stripeRouter, userRouter } from './routers'
import awsRouter from './routers/aws'

export const appRouter = createTRPCRouter({
  stripe: stripeRouter,
  user: userRouter,
  aws: awsRouter,
})

export type AppRouter = typeof appRouter

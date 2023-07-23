import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'test', 'production']),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === 'production' ? z.string().min(1) : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string().min(1) : z.string().url(),
    ),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    STRIPE_SECRET: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
    STRIPE_PRODUCT_ID: z.string(),
    BASE_URL: z.string().url(),
    AWS_ACCESS_KEY: z.string(),
    AWS_SECRET_KEY: z.string(),
    AWS_BUCKET_NAME: z.string(),
    WEBHOOK: z.string(),
    RUNPOD_KEY: z.string(),
    RESEND: z.string(),
  },

  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    STRIPE_SECRET: process.env.STRIPE_SECRET,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRODUCT_ID: process.env.STRIPE_PRODUCT_ID,
    BASE_URL: process.env.BASE_URL,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    WEBHOOK: process.env.WEBHOOK,
    RUNPOD_KEY: process.env.RUNPOD_KEY,
    RESEND: process.env.RESEND,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})

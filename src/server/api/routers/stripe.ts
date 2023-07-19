import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import Stripe from 'stripe'
import { env } from '@/env.mjs'
import { TRPCError } from '@trpc/server'

const stripe = new Stripe(env.STRIPE_SECRET, {
  apiVersion: '2022-11-15',
})

export const stripeRouter = createTRPCRouter({
  checkout: protectedProcedure.mutation(async () => {
    const product = await stripe.products.retrieve(env.STRIPE_PRODUCT_ID)

    if (!product.default_price) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Product not found',
      })
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: product.default_price.toString(),
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${env.BASE_URL}/?success=true`,
      cancel_url: `${env.BASE_URL}/?canceled=true`,
    })

    return session.url
  }),
})

import { env } from '@/env.mjs'
import { prisma } from '@/server/db'
import { StatusCodes } from 'http-status-codes'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Readable } from 'node:stream'
import Stripe from 'stripe'

const stripe = new Stripe(env.STRIPE_SECRET, {
  apiVersion: '2022-11-15',
})

type userDetails = {
  billing_details: {
    email: string
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

async function buffer(readable: Readable) {
  const chunks = []

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

const stripeWebhook = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const rawBody = buf.toString('utf8')

    const signature = req.headers['stripe-signature']

    if (!signature) {
      return res.status(StatusCodes.BAD_REQUEST).end()
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET)
      const user = event.data.object as userDetails

      if ((event.type = 'charge.succeeded')) {
        await prisma.user.update({
          where: {
            email: user.billing_details.email,
          },
          data: {
            isPaymentSucceeded: true,
            modelTrainingLimit: 1,
          },
        })
      }

      return res.status(StatusCodes.OK).end()
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).end()
    }
  } else {
    res.setHeader('Allow', 'POST')
    return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ message: 'Method not allowed' })
  }
}

export default stripeWebhook

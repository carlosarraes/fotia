import { prisma } from '@/server/db'
import { Resend } from 'resend'
import { env } from '@/env.mjs'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3 } from '@/utils/s3'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { PutObjectCommandInput } from '@aws-sdk/client-s3'

type AxiosResponse = {
  delayTime: number
  executionTime: number
  id: string
  status: string
  output: {
    inference: Inference[]
  }
}

type Inference = {
  images: string[]
}

const resend = new Resend(env.RESEND)

const uploadToS3 = async (image: string, id: number, userId: string) => {
  const response = await axios.get(image, { responseType: 'arraybuffer' })
  const data = response.data as ArrayBuffer
  const buffer = Buffer.from(data)

  const params: PutObjectCommandInput = {
    Bucket: env.AWS_BUCKET_NAME,
    Key: `fotia/${userId}/done/photo-${id}.jpeg`,
    Body: buffer,
    ContentType: 'image/jpeg',
  }

  return new PutObjectCommand(params)
}

const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const userId = req.query.userId as string
      const data = req.body as AxiosResponse

      if (!userId) return res.status(400).json({ message: 'Missing user id' })

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      if (!user) return res.status(404).json({ message: 'User not found' })

      if (data.status !== 'COMPLETED') {
        void resend.emails.send({
          from: 'Acme <onboarding@resend.dev>',
          to: 'carraeshb@gmail.com',
          subject: 'Something went wrong',
          html: `<p>${userId}</p>`,
        })

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            modelTrainingLimit: {
              increment: 1,
            },
            modelDoneTraining: false,
          },
        })
        return
      }

      const images = data.output.inference[0]?.images
      const putCommandsPromises: Promise<PutObjectCommand>[] =
        images?.map((image, index) => uploadToS3(image, index, userId)) ?? []

      const putCommands = await Promise.all(putCommandsPromises)
      await Promise.all(putCommands.map((command) => s3.send(command)))

      if (!!user.email)
        void resend.emails.send({
          from: 'Acme <onboarding@resend.dev>',
          to: `${user.email}`,
          subject: 'Your images are ready',
          html: `<p>🎉🎉🎉🎉🎉🎉🎉🎉🎉</p>`,
        })

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          modelDoneTraining: true,
        },
      })

      return res.status(200).json({ message: 'done' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default webhook

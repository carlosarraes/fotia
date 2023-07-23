import { GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { s3 } from './s3'
import { env } from '@/env.mjs'
import { TRPCError } from '@trpc/server'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const getAllUserImgs = async (userId: string, done?: boolean) => {
  let path = `fotia/${userId}/`

  if (done) {
    path += 'done/'
  }

  const { Contents } = await s3.send(
    new ListObjectsV2Command({
      Bucket: env.AWS_BUCKET_NAME,
      Prefix: path,
    }),
  )

  if (!Contents) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'No images found',
    })
  }

  const objCommands = Contents.map(({ Key }) => {
    return new GetObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: Key as string,
    })
  })

  const signedUrls = await Promise.all(
    objCommands.map((command) =>
      getSignedUrl(s3, command, {
        expiresIn: 120,
      }),
    ),
  )

  const mappedUrls = signedUrls.map((url, i) => {
    if (!Contents[i]) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No images found',
      })
    }

    const key = Contents[i]?.Key
    if (!key) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No images found',
      })
    }

    const id = key.split('/')[2]
    if (!id) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No images found',
      })
    }

    return {
      url,
      key,
      id,
    }
  })

  return mappedUrls.filter(({ id }) => id !== 'data.zip')
}

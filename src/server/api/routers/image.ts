import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { getAllUserImgs } from '@/utils/getAllImgs'
import smartcrop from 'smartcrop-sharp'
import sharp from 'sharp'
import axios from 'axios'
import JSZip from 'jszip'
import { s3 } from '@/utils/s3'
import { env } from '@/env.mjs'
import { PutObjectCommand } from '@aws-sdk/client-s3'

const HEIGHT = 512
const WIDTH = 512

const zip = new JSZip()

export const imageRouter = createTRPCRouter({
  processImage: protectedProcedure.mutation(async ({ ctx: { session } }) => {
    const images = await getAllUserImgs(session.user.id)

    const folder = zip.folder('data')
    for (const image of images) {
      const { data } = await axios.get<Buffer>(image.url, {
        responseType: 'arraybuffer',
      })

      const result = await smartcrop.crop(data, {
        width: WIDTH,
        height: HEIGHT,
      })

      const photoBuffer = await sharp(data)
        .extract({
          width: result.topCrop.width,
          height: result.topCrop.height,
          left: result.topCrop.x,
          top: result.topCrop.y,
        })
        .resize(WIDTH, HEIGHT)
        .toBuffer()

      folder?.file(image.key, photoBuffer, {
        binary: true,
      })
    }

    const zipFile = await folder?.generateAsync({
      type: 'nodebuffer',
    })

    await s3.send(
      new PutObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: `fotia/${session.user.id}/data.zip`,
        Body: zipFile,
        ContentType: 'application/zip',
      }),
    )
  }),
})

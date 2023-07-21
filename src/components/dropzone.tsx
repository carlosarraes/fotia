import ImageBlobReducer from 'image-blob-reduce'
import { nanoid } from 'nanoid'
import Pica from 'pica'
import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import ShowImage from './show-image'
import { Button } from './ui/button'
import { api } from '@/utils/api'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const pica = Pica({ features: ['js', 'wasm', 'ww'] })
const reducer = new ImageBlobReducer({
  pica,
})

type fileWithPreview = File & { preview: string; id: string }

const Dropzone = () => {
  const [files, setFiles] = useState<fileWithPreview[]>([])
  const [uploading, setUploading] = useState(false)

  const ctx = api.useContext()
  const getAllImgs = api.aws.getAllImgs.useQuery()
  const processImgs = api.image.processImage.useMutation()
  const uploadUrls = api.aws.uploadImgs.useMutation({
    onError: (error) => {
      console.log(error)
      toast.error('Erro ao processar imagens')
    },
    onSuccess: async (data) => {
      try {
        setUploading(true)

        const resizedImgs: Blob[] = []

        for (const file of files) {
          const resizedBlob = await reducer.toBlob(
            new Blob([file], {
              type: 'image/jpeg',
            }),
            {
              max: 1000,
            },
          )
          resizedImgs.push(resizedBlob)
        }

        const promises = data.map((url, index) => axios.put(url, resizedImgs[index]))

        await Promise.all(promises)
        void ctx.aws.getAllImgs.invalidate()
        void processImgs.mutate()
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message)
          toast.error('Erro ao processar imagens')
          return
        }
        console.log(error)
      } finally {
        setUploading(false)
        setFiles([])
      }
    },
  })

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],
    },
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          id: nanoid(),
        }),
      )

      const s3ImgsLength = getAllImgs.data?.length ?? 0
      const allFiles = [...files, ...newFiles]
      allFiles.splice(10 - s3ImgsLength)

      setFiles(allFiles)
    },
    maxFiles: 10,
  })

  const handleDelete = (id: string) => {
    const newFiles = files.filter((file) => file.id !== id)

    setFiles(newFiles)
  }

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview))
  })

  return (
    <section className="mx-auto flex h-full w-full flex-col space-y-4 p-12">
      <div className="flex flex-wrap items-center justify-center">
        {files &&
          files.length > 0 &&
          files.map((file) => (
            <ShowImage
              key={file.id}
              id={file.id}
              url={file.preview}
              name={file.name}
              handleDelete={handleDelete}
              cloud={false}
            />
          ))}
      </div>
      <div
        {...getRootProps()}
        className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-black bg-slate-100 p-10 hover:bg-slate-300/90 shadow dark:shadow-gray-100"
      >
        <input {...getInputProps()} className="h-full w-full" />
        <p className="text-slate-900">
          Arraste 7 a 10 imagens para aqui, ou clique para selecionar os arquivos
        </p>
      </div>
      {files && files.length > 0 && (
        <Button
          variant="outline"
          className="rounded hover:bg-slate-800 transition duration-100"
          onClick={() => {
            uploadUrls.mutate({
              images: files.map((file) => ({
                id: file.id,
              })),
            })
          }}
        >
          {uploading ? 'Processando...' : 'Processar e salvar imagens'}
        </Button>
      )}
    </section>
  )
}

export default Dropzone

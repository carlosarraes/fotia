import ImageBlobReducer from 'image-blob-reduce'
import { X } from 'lucide-react'
import { nanoid } from 'nanoid'
import Image from 'next/image'
import Pica from 'pica'
import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import ShowImage from './show-image'
import { Button } from './ui/button'

const pica = Pica({ features: ['js', 'wasm', 'ww'] })
const reducer = new ImageBlobReducer({
  pica,
})

type fileWithPreview = File & { preview: string; id: string }

const Dropzone = () => {
  const [files, setFiles] = useState<fileWithPreview[]>([])
  const [uploading, setUploading] = useState(false)

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

      const allFiles = [...files, ...newFiles]

      console.log(allFiles)
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
      <div
        {...getRootProps()}
        className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-black bg-slate-100 p-10 hover:bg-slate-300/90 shadow dark:shadow-gray-100"
      >
        <input {...getInputProps()} className="h-full w-full" />
        <p className="text-slate-900">
          Arraste 7 a 10 imagens para aqui, ou clique para selecionar os arquivos
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center">
        {files &&
          files.length > 0 &&
          files.map((file) => (
            <ShowImage
              key={file.id}
              id={file.id}
              preview={file.preview}
              name={file.name}
              handleDelete={handleDelete}
            />
          ))}
      </div>
      {files && files.length > 0 && (
        <Button variant="outline" className="rounded hover:bg-slate-800 transition duration-100">
          {uploading ? 'Processando...' : 'Processar e salvar imagens'}
        </Button>
      )}
    </section>
  )
}

export default Dropzone

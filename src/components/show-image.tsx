import { api } from '@/utils/api'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { ImSpinner8 } from 'react-icons/im'

type ShowImageProps = {
  id: string
  url: string
  name?: string
  handleDelete?: (id: string) => void
  cloud: boolean
  ready?: boolean
}

const ShowImage = ({ id, url, name, handleDelete, cloud, ready }: ShowImageProps) => {
  const [loading, setLoading] = useState(false)

  const utils = api.useContext()
  const deleteImg = api.aws.deleteImg.useMutation({
    onSuccess: () => {
      toast.success('Imagem deletada com sucesso')
      void utils.aws.getAllImgs.invalidate()
      setLoading(false)
    },
  })

  return (
    <div className="relative m-2 h-[200px] w-[200px]">
      {loading && (
        <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-black/20">
          <ImSpinner8 className="h-10 w-10 animate-spin text-white" />
        </div>
      )}
      {!ready && (
        <button
          className="absolute right-0 top-0 m-1 cursor-pointer rounded-xl bg-black/40 p-2 text-white duration-100 hover:bg-black/60"
          onClick={() => {
            setLoading(true)
            if (handleDelete) handleDelete(id)
            if (cloud) deleteImg.mutate({ key: id })
          }}
        >
          <X className="h-5 w-5" />
        </button>
      )}
      <Image
        src={url}
        alt={name ?? 'image'}
        className="h-full w-full object-cover"
        width={200}
        height={200}
      />
    </div>
  )
}

export default ShowImage

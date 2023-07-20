import { api } from '@/utils/api'
import { X } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

type ShowImageProps = {
  id: string
  url: string
  name?: string
  handleDelete?: (id: string) => void
  cloud: boolean
}

const ShowImage = ({ id, url, name, handleDelete, cloud }: ShowImageProps) => {
  const utils = api.useContext()
  const deleteImg = api.aws.deleteImg.useMutation({
    onSuccess: () => {
      toast.success('Imagem deletada com sucesso')
      void utils.aws.getAllImgs.invalidate()
    },
  })

  return (
    <div className="relative m-2 h-[200px] w-[200px]">
      <button
        className="absolute right-0 top-0 m-1 cursor-pointer rounded-xl bg-black/40 p-2 text-white duration-100 hover:bg-black/60"
        onClick={() => {
          if (handleDelete) handleDelete(id)
          if (cloud) deleteImg.mutate({ key: id })
        }}
      >
        <X className="h-5 w-5" />
      </button>
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

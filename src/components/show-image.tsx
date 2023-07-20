import { X } from 'lucide-react'
import Image from 'next/image'

type ShowImageProps = {
  id: string
  preview: string
  name: string
  handleDelete?: (id: string) => void
}

const ShowImage = ({ id, preview, name, handleDelete }: ShowImageProps) => {
  return (
    <div key={id} className="relative m-2 h-[200px] w-[200px]">
      <button
        className="absolute right-0 top-0 m-1 cursor-pointer rounded-xl bg-black/40 p-2 text-white duration-100 hover:bg-black/60"
        onClick={() => {
          if (handleDelete) handleDelete(id)
        }}
      >
        <X className="h-5 w-5" />
      </button>
      <Image
        src={preview}
        alt={name}
        className="h-full w-full object-cover"
        width={200}
        height={200}
      />
    </div>
  )
}

export default ShowImage

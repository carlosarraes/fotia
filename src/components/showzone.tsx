import { api } from '@/utils/api'
import ShowImage from './show-image'
import { Button } from './ui/button'
import Locker from './locker'
import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/router'

type ShowzoneProps = {
  ready?: boolean
}

const Showzone = ({ ready }: ShowzoneProps) => {
  const router = useRouter()

  const getAllImgs = api.aws.getAllImgs.useQuery()

  return (
    <section className="flex flex-col w-full border rounded border-slate-800 p-8 bg-gray-500 text-white">
      <div className="flex justify-between border-b border-slate-800 my-2">
        <h2 className="text-2xl font-bold">Arquivos na nuvem:</h2>
        <Locker ready={ready} />
      </div>
      {getAllImgs.isSuccess && getAllImgs.data?.length > 0 && (
        <div className="flex flex-wrap items-center justify-center">
          {getAllImgs.data.map((file) => (
            <ShowImage key={file.id} id={file.id} url={file.url} cloud ready={ready} />
          ))}
        </div>
      )}
      <Button
        variant="outline"
        className="w-full mt-4 hover:bg-gray-600 group"
        disabled={!ready}
        onClick={() => {
          void router.push('/control')
        }}
      >
        Escolher prompt e treinar modelo
        <ChevronRight className="ml-2 group-hover:translate-x-1 transition" />
      </Button>
    </section>
  )
}

export default Showzone

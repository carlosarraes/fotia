import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { FaLock, FaUnlock } from 'react-icons/fa'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'
import { api } from '@/utils/api'
import { toast } from 'react-hot-toast'

type LockerProps = {
  ready?: boolean
}

const Locker = ({ ready }: LockerProps) => {
  const utils = api.useContext()

  const readyToTrain = api.user.updateReadyToTrain.useMutation({
    onSuccess: () => {
      toast.success('Fotos lockadas com sucesso')
      void utils.user.getReadyToTrain.invalidate()
    },
  })

  if (ready) {
    return (
      <div className="flex gap-3 justify-center items-center cursor-pointer">
        <span>Lockado!</span>
        <ChevronLeft className="h-4 w-4 self-center" />
        <FaLock className="h-4 w-4 self-center" />
      </div>
    )
  }

  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex gap-3 justify-center items-center cursor-pointer group">
          <span>Clique para lockar as fotos</span>
          <ChevronRight className="h-4 w-4 self-center transition group-hover:translate-x-1" />
          <FaUnlock className="h-4 w-4 self-center" />
        </div>
      </DialogTrigger>
      <DialogContent className="bg-gray-50 dark:bg-slate-800">
        <DialogHeader>
          <DialogTitle>Esse processo é irreversível!</DialogTitle>
        </DialogHeader>
        <span className="mt-2">
          Ao clicar em <b>lockar</b>, você não poderá mais deletar ou fazer upload das fotos para a
          nuvem.
        </span>
        <Button
          className="mt-4 w-full hover:bg-gray-700"
          variant="outline"
          onClick={() => {
            readyToTrain.mutate()
          }}
        >
          Lockar
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default Locker

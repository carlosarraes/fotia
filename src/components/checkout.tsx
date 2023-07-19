import { api } from '@/utils/api'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { CreditCard } from 'lucide-react'
import { MdPix } from 'react-icons/md'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'

const Checkout = () => {
  const router = useRouter()

  const checkout = api.stripe.checkout.useMutation({
    onSuccess: (url) => {
      if (url) void router.push(url)
    },
  })

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)

    if (query.has('success')) {
      toast.success('Pagamento realizado com sucesso!')
    }

    if (query.has('canceled')) {
      toast.error('Pagamento cancelado!')
    }
  }, [])

  return (
    <Dialog>
      <DialogTrigger className="text-center mx-auto">Comprar serviços</DialogTrigger>
      <DialogContent className="bg-gray-50 dark:bg-slate-800">
        <DialogHeader>
          <DialogTitle>Escolha a forma de pagamento:</DialogTitle>
        </DialogHeader>
        <section className="flex flex-col gap-4">
          <section className="flex justify-between gap-4">
            <Button
              variant="outline"
              className="flex h-28 flex-col w-1/2 space-y-4 rounded border-2 border-gray-300 hover:bg-gray-300 bg-gray-300 dark:border-slate-700 p-4 dark:bg-slate-700"
              onClick={() => checkout.mutate()}
            >
              <CreditCard size={36} />
              <span>Cartão de crédito</span>
            </Button>
            <Button
              variant="outline"
              className="flex h-28 flex-col w-1/2 space-y-4 rounded border-2 border-gray-300 hover:bg-gray-300 bg-gray-300 dark:border-slate-700 p-4 dark:bg-slate-700"
              disabled
            >
              <MdPix size={36} />
              <span>PIX (em breve)</span>
            </Button>
          </section>
        </section>
        <hr />
        <DialogFooter className="mx-auto">txt2image em breve!</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default Checkout

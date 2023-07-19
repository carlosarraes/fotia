import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'

const Checkout = () => {
  return (
    <Dialog>
      <DialogTrigger>Comprar serviços</DialogTrigger>
      <DialogContent className="bg-gray-50 dark:bg-slate-800">
        <DialogHeader>
          <DialogTitle>Escolha o serviço que deseja comprar:</DialogTitle>
        </DialogHeader>
        Here
      </DialogContent>
    </Dialog>
  )
}

export default Checkout

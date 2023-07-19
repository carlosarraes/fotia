import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Button } from './ui/button'

const Checkout = () => {
  return (
    <Dialog>
      <DialogTrigger className="text-center mx-auto">Comprar serviços</DialogTrigger>
      <DialogContent className="bg-gray-50 dark:bg-slate-800">
        <DialogHeader>
          <DialogTitle>Escolha a forma de pagamento:</DialogTitle>
        </DialogHeader>
        <section className="flex flex-col gap-4">
          <section className="flex justify-between gap-4">
            <Card className="w-1/2 border-4">
              <CardHeader>
                <CardTitle>Cartão</CardTitle>
                <CardDescription>Utilizamos o Stripe</CardDescription>
              </CardHeader>
              <CardContent>R$ 7,90</CardContent>
            </Card>
            <Card className="w-1/2">
              <CardHeader>
                <CardTitle>PIX</CardTitle>
                <CardDescription>Em breve!</CardDescription>
              </CardHeader>
              <CardContent>R$ 7,90</CardContent>
            </Card>
          </section>
          <Button
            type="button"
            variant="outline"
            className="w-full hover:bg-gray-100 dark:hover:bg-slate-900"
          >
            Comprar
          </Button>
        </section>
        <hr />
        <DialogFooter className="mx-auto">txt2image em breve!</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default Checkout

import { signIn } from 'next-auth/react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { FaGoogle } from 'react-icons/fa'

const Login = () => {
  return (
    <Dialog>
      <DialogTrigger className="text-center mx-auto">Entrar</DialogTrigger>
      <DialogContent className="bg-gray-50 dark:bg-slate-800">
        <DialogHeader>
          <DialogTitle>Faça login com sua conta:</DialogTitle>
        </DialogHeader>
        <Button type="button" variant="outline" onClick={() => void signIn('google')}>
          <FaGoogle />
          <span className="ml-2">com Google</span>
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default Login

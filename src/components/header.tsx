import { Button } from './ui/button'
import { FaGoogle } from 'react-icons/fa'
import { ModeToggle } from './ui/mode-toggle'
import { Separator } from './ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { signIn, signOut, useSession } from 'next-auth/react'

const Header = () => {
  const { status } = useSession()

  console.log(status)

  return (
    <header className="flex w-full justify-between bg-transparent px-10 py-4">
      <h1 className="font-bold tracking-wider text-xl">
        Fot<span className="text-sky-700">IA</span>
      </h1>
      <div className="flex space-x-6">
        <ModeToggle />
        <Separator orientation="vertical" />
        {status === 'authenticated' ? (
          <Button type="button" onClick={() => void signOut()}>
            <span className="text-lg">Sair</span>
          </Button>
        ) : (
          <Dialog>
            <DialogTrigger>Entrar</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Faça login com sua conta:</DialogTitle>
              </DialogHeader>
              <Button type="button" variant="outline" onClick={() => void signIn('google')}>
                <FaGoogle />
                <span className="ml-2">com Google</span>
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </header>
  )
}

export default Header

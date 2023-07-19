import { Button } from './ui/button'
import { FaCameraRetro } from 'react-icons/fa'
import { ModeToggle } from './ui/mode-toggle'
import { signOut, useSession } from 'next-auth/react'
import Login from './login'

const Header = () => {
  const { status } = useSession()

  console.log(status)

  return (
    <header className="flex w-full justify-between bg-transparent px-10 py-4 border-b border-x border-slate-800">
      <div className="flex items-center justify-center gap-2 text-xl">
        <FaCameraRetro className="inline-block text-sky-600" />
        <div className="font-bold tracking-wider">
          Fot<span className="text-sky-600">IA</span>
        </div>
      </div>
      <div className="flex space-x-6">
        <ModeToggle />
        {status === 'authenticated' ? (
          <Button type="button" onClick={() => void signOut()}>
            <span className="text-lg">Sair</span>
          </Button>
        ) : (
          <Login />
        )}
      </div>
    </header>
  )
}

export default Header

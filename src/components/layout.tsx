import Header from './header'

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <section className="mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center border-2 border-red-500">
      <Header />
      {children}
    </section>
  )
}

export default Layout

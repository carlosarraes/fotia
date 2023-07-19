import Header from './header'

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <section className="mx-auto flex h-screen w-full max-w-4xl flex-col items-center justify-center">
      <Header />
      {children}
    </section>
  )
}

export default Layout

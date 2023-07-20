import Dropzone from '@/components/dropzone'
import Layout from '@/components/layout'
import Showzone from '@/components/showzone'

const Dashboard = () => {
  return (
    <Layout>
      <section className="flex flex-col w-full justify-center items-start text-center md:text-left p-4 border-x border-b h-screen border-slate-800">
        <Showzone />
        <Dropzone />
      </section>
    </Layout>
  )
}

export default Dashboard

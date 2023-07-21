import Dropzone from '@/components/dropzone'
import Layout from '@/components/layout'
import Showzone from '@/components/showzone'
import { api } from '@/utils/api'

const Dashboard = () => {
  const getAllImgs = api.aws.getAllImgs.useQuery()
  const readyToTrain = api.user.getReadyToTrain.useQuery()

  return (
    <Layout>
      <section className="flex flex-col w-full h-full gap-4 items-center text-center md:text-left p-4 border-x border-b border-slate-800 overflow-y-auto">
        {getAllImgs.isSuccess && getAllImgs.data?.length > 0 && (
          <Showzone ready={readyToTrain.data} />
        )}
        {!readyToTrain.data && (
          <section className="flex flex-col w-full border rounded border-slate-800 p-8">
            <h2 className="text-2xl font-bold border-b border-slate-800 my-2">
              Faça o upload dos arquivos
            </h2>
            <Dropzone />
          </section>
        )}
      </section>
    </Layout>
  )
}

export default Dashboard

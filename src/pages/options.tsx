import Layout from '@/components/layout'
import Readyzone from '@/components/readyzone'
import { api } from '@/utils/api'

const Options = () => {
  const getAllImgs = api.aws.getAllImgs.useQuery()

  return (
    <Layout>
      <section className="flex flex-col w-full h-full gap-4 items-center text-center md:text-left p-4 border-x border-b border-slate-800 overflow-y-auto">
        {getAllImgs.isSuccess && getAllImgs.data?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {getAllImgs.data.map((file) => (
              <Readyzone key={file.id} size={250} url={file.url} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  )
}

export default Options

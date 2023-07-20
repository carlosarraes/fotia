import { api } from '@/utils/api'
import ShowImage from './show-image'

const Showzone = () => {
  const getAllImgs = api.aws.getAllImgs.useQuery()

  return (
    <section className="w-full text-center">
      {getAllImgs.isSuccess && getAllImgs.data?.length > 0 && (
        <div className="flex flex-wrap items-center justify-center">
          {getAllImgs.data.map((file) => (
            <ShowImage key={file.id} id={file.id} url={file.url} cloud />
          ))}
        </div>
      )}
    </section>
  )
}

export default Showzone

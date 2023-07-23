import Image from 'next/image'

type ReadyzoneProps = {
  url: string
  size: number
  name?: string
}

const Readyzone = ({ url, name, size }: ReadyzoneProps) => {
  return <Image src={url} alt={name ?? 'image'} width={size} height={size} />
}

export default Readyzone

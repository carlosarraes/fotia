import Layout from '@/components/layout'
import Main from '@/components/main'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>FotIA</title>
        <meta name="description" content="Crie fotos incríveis" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Main />
      </Layout>
    </>
  )
}

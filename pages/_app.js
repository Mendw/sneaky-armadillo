import '../styles/globals.css'
import Layout from '../components/layout'
import Head from 'next/head'

function CustomApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Hoshi Mangas</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

export default CustomApp

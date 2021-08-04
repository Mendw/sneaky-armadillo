import '../styles/globals.css'
import Layout from '../components/layout'
import Head from 'next/head'
import { Provider } from '../lib/session'

function CustomApp({ Component, pageProps }) {
  return (
    <Provider>
      <Head>
        <title>Hoshi Mangas</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}

export default CustomApp

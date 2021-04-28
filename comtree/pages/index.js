import { useAuth } from "../firebase/firebaseAuth"

import Head from 'next/head'

import Layout from "../components/Layout"
import Map from "../components/Map/Map"
import Home from "../components/Auth/Home"

export default function Root() {

  const { user } = useAuth()
  console.log(user)

  if (user) {
    return (
      <main>
      <Head>
        <title>comTree</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
      <Map />
      </Layout>

  

    </main>
    )
  }

  else {
    return (
    <main>
      <Head>
        <title>comTree</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Home />
  

    </main>
  )
  }
  
}



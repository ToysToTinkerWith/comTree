import Head from 'next/head'

import firebase from "../firebase/firebaseInit"

import Map from "../components/Map"

firebase()

export default function Home() {
  return (
    <main>
      <Head>
        <title>comTree</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Map />
  

    </main>
  )
}



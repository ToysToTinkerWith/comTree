import React, { useState } from "react";
import Head from 'next/head'
import { useAuth } from "../firebase/firebaseAuth"

import Nav from "../components/Nav"
import Map from "../components/Map/Map"
import Auth from "../components/Auth/Auth"
import Tree from "../components/Tree/Tree"

export default function Root() {

  const { user } = useAuth()

  const [page, setPage] = useState("map")
  const [tree, setTree] = useState(null)

  console.log(user)

  return (
    <main>
    <Head>
      <title>comTree</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <Nav user={user} setPage={setPage} />

    {page === "map" ?
    <Map user={user} setPage={setPage} setTree={setTree} />
    :
    null
    }

    {page === "auth" ?
    <Auth setPage={setPage}/>
    :
    null
    }

    {page === "tree" ?
    <Tree user={user} tree={tree} />
    :
    null
    }



  </main>
  )
  }

 



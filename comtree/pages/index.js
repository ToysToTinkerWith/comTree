import React, { useState } from "react";
import Head from 'next/head'
import { useAuth } from "../firebase/firebaseAuth"

import Nav from "../components/Nav"
import Map from "../components/Map/Map"
import Auth from "../components/Auth/Auth"
import UploadTree from "../components/Upload/UploadTree"
import Profile from "../components/Profile/Profile"
import Tree from "../components/Tree/Tree"


export default function Root() {

  const { user } = useAuth()

  const [page, setPage] = useState("Map")
  const [tree, setTree] = useState(null)

  return (
    <main>
    <Head>
      <title>comTree</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>

    
    <Nav user={user} setPage={setPage} />

    {page === "Map" ?
    <Map user={user} setPage={setPage} setTree={setTree} />
    :
    null
    }

    {page === "Auth" ?
    <Auth setPage={setPage}/>
    :
    null
    }

    {page === "Upload" ?
    <UploadTree user={user}/>
    :
    null
    }

    {page === "Profile" ?
    <Profile user={user} setPage={setPage} setTree={setTree}/>
    :
    null
    }

    {page === "Tree" ?
    <Tree user={user} tree={tree} />
    :
    null
    }



  </main>
  )
  }

 



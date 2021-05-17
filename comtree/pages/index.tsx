import React, { useState } from "react";
import Head from 'next/head'
import { useAuth } from "../firebase/firebaseAuth"

import Nav from "../components/Nav"
import Map from "../components/Map/Map"
import Auth from "../components/Auth/Auth"
import UploadTree from "../components/Upload/UploadTree"
import Profile from "../components/Profile/Profile"
import Tree from "../components/Tree/Tree"

import { Modal } from "@material-ui/core"


export default function Index() {

  const { user } = useAuth()

  const [page, setPage] = useState("")
  const [tree, setTree] = useState(null)

  return (
    <main>
    <Head>
      <title>comTree</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>

    
    <Nav user={user} setPage={setPage} />

    <Map user={user} setPage={setPage} setTree={setTree} />

    

    {page === "Auth" ?
    <Modal 
    open={true} 
    onClose={() => setPage("")}
    style={{
      marginTop: 50,
      marginRight: 100,
      marginBottom: 50,
      marginLeft: 100,
      overflowY: "auto",
      overflowX: "hidden"
    }}>
    <Auth setPage={setPage}/>
  </Modal>
    
    :
    null
    }

    {page === "Upload" ?
    <Modal 
    open={true} 
    onClose={() => setPage("")}
    style={{
      marginTop: 50,
      marginRight: 100,
      marginBottom: 50,
      marginLeft: 100,
      overflowY: "auto",
      overflowX: "hidden"
    }}>
    <UploadTree user={user}/>
  </Modal>
    
    :
    null
    }

    {page === "Profile" ?
    <Modal 
    open={true} 
    onClose={() => setPage("")}
    style={{
      marginTop: 50,
      marginRight: 100,
      marginBottom: 50,
      marginLeft: 100,
      overflowY: "auto",
      overflowX: "hidden"
    }}>
    <Profile user={user} setPage={setPage} setTree={setTree}/>
  </Modal>
    
    :
    null
    }

    {page === "Tree" ?
    <Modal 
    open={true} 
    onClose={() => setPage("")}
    style={{
      marginTop: 50,
      marginRight: 100,
      marginBottom: 50,
      marginLeft: 100,
      overflowY: "auto",
      overflowX: "hidden"
    }}>
    <Tree user={user} tree={tree} />
  </Modal>
    
    :
    null
    }



  </main>
  )
  }

 



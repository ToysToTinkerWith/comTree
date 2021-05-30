import React, { useState } from "react";
import Head from 'next/head'
import { useAuth } from "../components/firebase/firebaseAuth"

import Nav from "../components/Nav"
import Map from "../components/Map/Map"
import Auth from "../components/Auth/Auth"
import UploadTree from "../components/Upload/UploadTree"
import Profile from "../components/Profile/Profile"
import Mission from "../components/Mission/Mission"
import Tree from "../components/Tree/Tree"
import Database from "../components/Database/Database"

import { Modal, Fab } from "@material-ui/core"
import StorageIcon from '@material-ui/icons/Storage';


export default function Index() {

  const { user } = useAuth()

  const [page, setPage] = useState("")
  const [tree, setTree] = useState(null)

  const admins = ["K5TMyBC5ycfPal15xDtmLuynYvJ2", "Spu0qqpTDIMtP90iDQS957MBmOx1"]

  return (
    <main>
    <Head>
      <title>comTree</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>

    
    <Nav user={user} setPage={setPage} />

    <Map user={user} setPage={setPage} setTree={setTree} />

    {user ?
    admins.includes(user.uid) ?
    <Fab  color="primary" 
    style={{position: "absolute", top: 5, right: 145}}
    onClick={() => setPage("Database")}>
    <StorageIcon />
    </Fab> 
    :
    null
    :
    null}

    

    {page === "Auth" ?
    <Modal 
    open={true} 
    onClose={() => setPage("")}
    style={{
      marginTop: 75,
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
      marginTop: 75,
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
      marginTop: 75,
      overflowY: "auto",
      overflowX: "hidden"
    }}>
    <Profile user={user} setPage={setPage} setTree={setTree}/>
    </Modal>
    
    :
    null
    }

    {page === "Mission" ?
    <Modal 
    open={true} 
    onClose={() => setPage("")}
    style={{
      marginTop: 75,
      overflowY: "auto",
      overflowX: "hidden"
    }}>
    <Mission />
    </Modal>
    
    :
    null
    }

    {page === "Tree" ?
    <Modal 
    open={true} 
    onClose={() => setPage("")}
    style={{
      marginTop: 75,
      overflowY: "auto",
      overflowX: "hidden"
    }}>
    <Tree user={user} tree={tree} admins={admins}/>
    </Modal>
    
    :
    null
    }

    {page === "Database" ?
    <Modal 
    open={true} 
    onClose={() => setPage("")}
    style={{
      marginTop: 75,
      overflowY: "auto",
      overflowX: "hidden"
    }}>
    <Database setPage={setPage} setTree={setTree}/>
    </Modal>
    
    :
    null
    }



  </main>
  )
  }

 



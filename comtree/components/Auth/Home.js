import React, { useState } from "react"
import LogIn from "./LogIn"
import SignUp from "./SignUp"

import { Typography, Button, Grid, Avatar, makeStyles } from '@material-ui/core'

import Image from "next/image"

const useStyles = makeStyles({
  root: {
    backgroundColor: "#F0FFF0"
  },
  
  title: {
    display: "inline"
  }

})

function Home(props) {

    const classes = useStyles()

    const [newUser, setNewUser] = useState(false)

      return (
      <div className={classes.root}>
        <br />
        <br />
        <br />
        <br />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} style={{textAlign: "center"}}>
          <Image src="/comtree.png" alt="" height={70} width={200} style={{ display: "inline-block" }} />
            <Typography variant="h5" align="center" color="secondary"> Hug a tree in your community. </Typography>
          </Grid>
          <Grid item xs={12} sm={6} style={{ paddingLeft:35}}>
            <LogIn />
            <br />
            <Button color="secondary" variant="outlined" onClick={() => setNewUser(!newUser)}> New User? </Button>
            <br />
            {newUser ?
            [<br />, 
            <SignUp />] :
            null}
          </Grid>
        </Grid>
        <br />
        <br />
        <br />
        <br />
        <br />
          
        
      </div>
    )
    
  }

export default Home
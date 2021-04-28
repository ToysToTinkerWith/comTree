import firebase from "firebase/app"
import "firebase/auth"
import { useAuth } from "../firebase/firebaseAuth"


import { AppBar, Typography, IconButton, Toolbar, makeStyles } from "@material-ui/core"

import AccountCircle from '@material-ui/icons/AccountCircle'
import AddIcon from '@material-ui/icons/Add';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import theme from "../theme"

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  }

}))

export default function Nav() {

  const classes = useStyles()

  const { user } = useAuth()

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
        <div className={classes.title}>
        <Typography variant="h5" color="secondary"> comTree </Typography>
        </div>
        <IconButton color="secondary" href="./profile">
          <AccountCircle />
        </IconButton>
        <IconButton color="secondary" href="./upload">
          <AddIcon />
        </IconButton>
        {user ? 
        <IconButton 
        onClick={async () => {
                await firebase.auth().signOut();
                window.location.href = "/";
              }}
              color="secondary">
          <ExitToAppIcon />
        </IconButton>
        :
        null
        }
        
        </Toolbar>
      </AppBar>
    </div>
  )
  
}
import firebase from "firebase/app"
import "firebase/auth"

import { AppBar, Typography, IconButton, Button, Toolbar, makeStyles } from "@material-ui/core"

import AccountCircle from '@material-ui/icons/AccountCircle'
import AddIcon from '@material-ui/icons/Add';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import StorefrontIcon from '@material-ui/icons/Storefront';

import theme from "../theme"

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  }

}))

export default function Nav(props) {

  const classes = useStyles()

  if (props.user) {
    return (
    <div>
      <AppBar position="static">
        <Toolbar>
        <div className={classes.title}>
        <Typography variant="h5" color="secondary"> comTree </Typography>
        </div>
        <IconButton color="secondary" onClick={() => props.setPage("map")}>
          <ImageSearchIcon />
        </IconButton>
        <IconButton color="secondary" onClick={() => props.setPage("upload")}>
          <AddIcon />
        </IconButton>
        <IconButton color="secondary" onClick={() => props.setPage("profile")}>
          <AccountCircle />
        </IconButton>
        <IconButton color="secondary" onClick={() => props.setPage("store")}>
          <StorefrontIcon />
        </IconButton>
        <IconButton 
        onClick={async () => {
                await firebase.auth().signOut();
              }}
              color="secondary">
          <ExitToAppIcon />
        </IconButton>
        
        </Toolbar>
      </AppBar>
    </div>
  )
  }

  else {
    return (
      <div>
      <AppBar position="static">
        <Toolbar>
        <div className={classes.title}>
        <Typography variant="h5" color="secondary"> comTree </Typography>
        </div>
        <IconButton color="secondary" onClick={() => props.setPage("map")}>
          <ImageSearchIcon />
        </IconButton>
        <IconButton color="secondary" onClick={() => props.setPage("auth")}>
          <AccountBoxIcon />
        </IconButton>

        </Toolbar>
      </AppBar>
    </div>
    )
    
  }

  
  
}
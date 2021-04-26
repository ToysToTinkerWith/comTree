import { AppBar, IconButton, makeStyles } from "@material-ui/core"
import AccountCircle from '@material-ui/icons/AccountCircle'

import theme from "../theme"

const useStyles = makeStyles((theme) => ({
  
  root: {
    color: "#F0FFF0"
  }

}))

export default function Nav() {

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar color="primary" position="static">
        <IconButton href="./profile">
          <AccountCircle />
        </IconButton>
      </AppBar>
    </div>
  )
  
}
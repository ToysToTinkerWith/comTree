import React from 'react';
import firebase from "firebase/app"

import { makeStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import AccountCircle from '@material-ui/icons/AccountCircle'
import AddIcon from '@material-ui/icons/Add';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import AssignmentIcon from '@material-ui/icons/Assignment';
import StorefrontIcon from '@material-ui/icons/Storefront';


const useStyles = makeStyles((theme) => ({
  speedDial: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
}));

export default function Nav(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  if (props.user) {
    return (
      <div>
        <div>
          <SpeedDial
            ariaLabel="Nav"
            className={classes.speedDial}
            icon={<img src="/comtreesym.svg" alt="comTree" style={{width: 50, height: 50}} />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            direction={"down"}
          >
            <SpeedDialAction
              icon={<AddIcon />}
              tooltipTitle={"Upload"}
              tooltipPlacement="left"
              onClick={() => props.setPage("Upload")}
            />
            <SpeedDialAction
              icon={<AccountCircle />}
              tooltipTitle={"Profile"}
              tooltipPlacement="left"
              onClick={() => props.setPage("Profile")}
            />
            <SpeedDialAction
              icon={<AssignmentIcon />}
              tooltipTitle={"Mission"}
              tooltipPlacement="left"
              onClick={() => props.setPage("Mission")}
            />
            <SpeedDialAction
              icon={<StorefrontIcon />}
              tooltipTitle={"Store"}
              tooltipPlacement="left"
              href="/store"
            />    
            <SpeedDialAction
              icon={<ExitToAppIcon/>}
              tooltipTitle={"Logout"}
              tooltipPlacement="left"
              onClick={async () => {
                  props.setPage("Map")
                  await firebase.auth().signOut();
                }}
            />
          </SpeedDial>
        </div>
      </div>
    )
  }
  else {
    return (
      <div>
        <div>
          <SpeedDial
            ariaLabel="Nav"
            className={classes.speedDial}
            icon={<img src="/comtreesym.svg" alt="comTree" style={{width: 50, height: 50}} />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            direction={"down"}
          >
            
            <SpeedDialAction
              icon={<AccountBoxIcon />}
              tooltipTitle={"Login"}
              tooltipPlacement="left"
              onClick={() => props.setPage("Auth")}
            />
            <SpeedDialAction
              icon={<AssignmentIcon />}
              tooltipTitle={"Mission"}
              tooltipPlacement="left"
              onClick={() => props.setPage("Mission")}
            />
            <SpeedDialAction
              icon={<StorefrontIcon />}
              tooltipTitle={"Store"}
              tooltipPlacement="left"
              href="/store"
            />
          </SpeedDial>
        </div>
      </div>
    )
  }

  
}

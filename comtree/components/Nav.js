import React from 'react';
import firebase from "firebase/app"

import { makeStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import AccountCircle from '@material-ui/icons/AccountCircle'
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import AssignmentIcon from '@material-ui/icons/Assignment';
import StorefrontIcon from '@material-ui/icons/Storefront';

import Image from "next/image"


const useStyles = makeStyles((theme) => ({
  speedDial: {
    position: 'absolute',
    top: 15,
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
            icon={<Image src="/comtreesymbolfinal.svg" alt="comTree" width={100} height={75}  />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            direction={"left"}
          >
            <SpeedDialAction
              icon={<AddIcon />}
              tooltipTitle={"Upload"}
              tooltipPlacement="bottom"
              onClick={() => props.setPage("Upload")}
            />
            <SpeedDialAction
              icon={<AccountCircle />}
              tooltipTitle={"Profile"}
              tooltipPlacement="bottom"
              onClick={() => props.setPage("Profile")}
            />
            <SpeedDialAction
              icon={<AssignmentIcon />}
              tooltipTitle={"Mission"}
              tooltipPlacement="bottom"
              onClick={() => props.setPage("Mission")}
            />
            <SpeedDialAction
              icon={<StorefrontIcon />}
              tooltipTitle={"Store"}
              tooltipPlacement="bottom"
              href="/store"
            />    
            <SpeedDialAction
              icon={<ArrowBackIcon />}
              tooltipTitle={"Logout"}
              tooltipPlacement="bottom"
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
            icon={<Image src="/comtreesymbolfinal.svg" alt="comTree" width={100} height={75}  />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            direction={"left"}
          >
            
            <SpeedDialAction
              icon={<AccountBoxIcon />}
              tooltipTitle={"Login"}
              tooltipPlacement="bottom"
              onClick={() => props.setPage("Auth")}
            />
            <SpeedDialAction
              icon={<AssignmentIcon />}
              tooltipTitle={"Mission"}
              tooltipPlacement="bottom"
              onClick={() => props.setPage("Mission")}
            />
            <SpeedDialAction
              icon={<StorefrontIcon />}
              tooltipTitle={"Store"}
              tooltipPlacement="bottom"
              href="/store"
            />
          </SpeedDial>
        </div>
      </div>
    )
  }

  
}

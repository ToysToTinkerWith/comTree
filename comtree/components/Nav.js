import React from 'react';
import firebase from "firebase/app"

import { makeStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import AccountCircle from '@material-ui/icons/AccountCircle'
import AddIcon from '@material-ui/icons/Add';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import StorefrontIcon from '@material-ui/icons/Storefront';

import Image from "next/image"


const useStyles = makeStyles((theme) => ({
  title: {
    zIndex: 2,
    position: "absolute",
  },
  speedDial: {
    zIndex: 1,
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
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
                icon={<ExitToAppIcon />}
                tooltipTitle={"Logout"}
                onClick={async () => {
                    props.setPage("Map")
                    await firebase.auth().signOut();
                  }}
              />
            <SpeedDialAction
              icon={<StorefrontIcon />}
              tooltipTitle={"Store"}
              href="/store"
            />    
            <SpeedDialAction
              icon={<AccountCircle />}
              tooltipTitle={"Profile"}
              onClick={() => props.setPage("Profile")}
            />
            <SpeedDialAction
              icon={<AddIcon />}
              tooltipTitle={"Upload"}
              onClick={() => props.setPage("Upload")}
            />  
            <SpeedDialAction
              icon={<ImageSearchIcon />}
              tooltipTitle={"Map"}
              onClick={() => props.setPage("Map")}
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
              onClick={() => props.setPage("Auth")}
            />
            <SpeedDialAction
              icon={<StorefrontIcon />}
              tooltipTitle={"Store"}
              href="/store"
            />
            <SpeedDialAction
              icon={<ImageSearchIcon />}
              tooltipTitle={"Map"}
              onClick={() => props.setPage("Map")}
            />
          </SpeedDial>
        </div>
      </div>
    )
  }

  
}

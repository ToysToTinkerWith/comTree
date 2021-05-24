import React from "react"

import { Avatar, IconButton } from "@material-ui/core"
import FlagIcon from '@material-ui/icons/Flag';

function Marker(props) {

    let adoptstyle

    if (props.user) {

      if (props.tree.huggedBy.includes(props.user.uid)) {
        adoptstyle = {
          border: "2px solid blue",
          width: props.width,
          height: props.width
        }
      }

      else if (props.tree.huggedBy.length > 0) {
        adoptstyle = {
          border: "2px solid green",
          width: props.width,
          height: props.width
        }
      }

      else {
        adoptstyle = {
          border: "2px solid red",
          width: props.width,
          height: props.width

        }
      }

    }

    else {
      adoptstyle = {
          border: "2px solid green",
          width: props.width,
          height: props.width
        }
    }

    if (props.tree.flag !== "") {
      return (
        <div>
          <FlagIcon style={{ color: "yellow", width: props.width, height: props.width }}/>
        </div>
      )
    }

    else {
      return (
        <div>
          <IconButton onClick={() => [props.setTree(props.tree), props.setPage("Tree")]} >
            <Avatar src={props.tree.imageUrl} style={adoptstyle}/>
          </IconButton>
        </div>
    )
    }

      
    
  }


export default Marker
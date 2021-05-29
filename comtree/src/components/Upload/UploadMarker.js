import React from "react"

import { Avatar } from "@material-ui/core"

class UploadMarker extends React.Component {

  render() {

      return (
      <div>
        <Avatar src={this.props.imageUrl} alt="" />
      </div>
      )
    
    
  }
}

export default UploadMarker

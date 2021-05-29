
import React from "react"
import { db } from "../firebase"

import { Typography, Button, Avatar } from "@material-ui/core"


 class ProfileLink extends React.Component {
  constructor() {
    super()
    this.state = {
      profile: null
    }
    
  }

  componentDidMount() {
    db.collection("profiles").where("uid", "==", this.props.ownerId).onSnapshot(snapshot => {
      let thisProfile = null

      snapshot.docs.forEach(doc => {
          thisProfile = doc.data()
      })
      
        this.setState({
          profile: thisProfile
      })
      
    })
  }

  render() {

    if (this.state.profile) {

      const ownerstyle = {
        backgroundColor: "#FFFFF0",
        borderRadius: "15px",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        paddingLeft: "10px",
        paddingRight: "10px",
        marginLeft: "10px",
        marginRight: "10px"
      }

      return (
        <div>
        <Typography variant="h5" align="left" color="secondary" display="inline"> Hugged by: </Typography>
        <Button style={ownerstyle} variant="outlined" startIcon={<Avatar src={this.state.profile.imageUrl}/>} onClick={() => [this.props.setViewProfile(this.state.profile), this.props.setPage("profileOther")]}> {this.state.profile.username}
      </Button>
        </div>
      )
    }

    else {
      return (
        <Typography> Loading... </Typography>
      )
    }

  }

}

export default ProfileLink
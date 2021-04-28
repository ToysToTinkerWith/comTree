import React from "react"
import EditProfile from "./editProfile"
import MyTrees from "./myTrees"
import { db } from "../firebase"

import { Typography, Avatar, IconButton } from "@material-ui/core"
import profilePic from "../images/profilePic.png"

let isMounted = false

class Profile extends React.Component {
  constructor() {
    super()
    this.state = {
      profile: null,
      editing: false
    }
    this.setEdit = this.setEdit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  setEdit() {
    this.setState({
      editing: !this.state.editing
    })
  }

   handleChange(event) {

    const {name, value} = event.target

    this.setState({[name]: value})
  }

  componentDidMount() {

    isMounted = true
    db.collection("profiles").where("uid", "==", this.props.uid)
    .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
            if (isMounted) {
              this.setState({
              profile: doc.data(),
              editing: false
              })
            }
            
        })
    });

  }

  componentWillUnmount(){
    isMounted = false
  }

  

  render() {

      const profilestyle = {
        backgroundColor: "#FFFFF0",
        borderRadius: "15px",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        paddingLeft: "10px",
        paddingRight: "10px",
        paddingTop: "10px",
        marginLeft: "10px",
        marginRight: "10px"
      }

    if (this.state.profile) {

      return (
      <div style={profilestyle}>
        <div style={{ textAlign: "center" }}>
          {this.state.profile.imageUrl ? 
            <IconButton onClick={() => this.setState({
              editing: !this.state.editing
            })} >
            <Avatar src={this.state.profile.imageUrl} alt="" style={{ height: "60px", width: "60px", display: "inline-block" }} />
            </IconButton> :
            <Avatar src={profilePic} alt="" style={{ height: '60px', width: '60px', display: "inline-block", marginRight: "10px" }} />
          }
          <Typography variant="h4" style={{ display: "inline-block", paddingTop: "10px" }} color="secondary"> {this.props.username} </Typography>
        </div>
          <Typography variant="subtitle1" align="center" color="secondary"> {this.state.profile.bio} </Typography>
        {this.state.editing ? 
          <EditProfile bio={this.state.profile.bio} setEdit={this.setEdit} uid={this.props.uid}/> :
          null }
        <br />
        <hr/>
        <MyTrees uid={this.props.uid} username={this.props.username} setPage={this.props.setPage} setViewTree={this.props.setViewTree} />
      </div>
      )
      
    }

    else {

      return (
        <div>
          <Typography variant="h2" align="left" color="secondary">  </Typography>
        </div>
      )

    }
    
  }
}

export default Profile
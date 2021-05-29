import React from "react"
import MyTrees from "./myTrees"
import { db } from "../firebase"

import { Typography, Grid, Avatar } from "@material-ui/core"
import profilePic from "../images/profilePic.png"

let isMounted = false

class ProfileOther extends React.Component {
  constructor() {
    super()
    this.state = {
      profile: null
    }
    this.handleChange = this.handleChange.bind(this)
  }

   handleChange(event) {

    const {name, value} = event.target

    this.setState({[name]: value})
  }

  componentDidMount() {

    isMounted = true
    db.collection("profiles").where("uid", "==", this.props.ouid)
    .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
            if (isMounted) {
              this.setState({
              profile: doc.data()
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
        marginLeft: "10px",
        marginRight: "10px"
      }

      if (this.state.profile) {
        return (
      <div style={profilestyle}>
        
        <Typography variant="h3" align="center" color="secondary"> {this.props.ousername} </Typography>
        <hr/>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={3}>
            {this.state.profile.imageUrl ? 
              <Avatar src={this.state.profile.imageUrl} alt="" style={{ height: "250px", width: "250px" }} /> :
              <Avatar src={profilePic} alt="" style={{ height: '200px', width: '200px' }} />
            }
            
          </Grid>
          <Grid item xs={12} sm={9}>
            <Typography variant="h5" align="left" color="secondary"> {this.state.profile.bio} </Typography>

          </Grid>
        </Grid>
        
        <br/>
        <hr/>
        <Typography variant="h3" align="center" color="secondary"> Hugging </Typography>
        <br/>
        <br/>
        <MyTrees suid={this.props.ouid} uid={this.props.uid} username={this.props.username} />

        
      </div>
      )
      }

      else {
        return (
          <div>
            <Typography variant="h2" color="secondary"> Loading... </Typography>
          </div>
        )
      }


      
      
  }
    
}

export default ProfileOther
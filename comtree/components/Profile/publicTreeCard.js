import React from "react"
import { db } from "../firebase"

import { Typography, Avatar, IconButton } from "@material-ui/core"


let isMounted = false

class PublicTreeCard extends React.Component {
  constructor() {
    super()
    this.state = {
      tree: null,
    }    
  }

  componentDidMount() {
    isMounted = true
    db.collection("publicTrees").onSnapshot(snapshot => {
      let thisTree = null

      snapshot.docs.forEach(doc => {
        if(doc.data().psudeoId === this.props.psudeoId) {
          thisTree = doc.data()

        }
      })
      
      if (isMounted) {
        this.setState({
          tree: thisTree,
      })
      }
      
    })
  }

  componentWillUnmount(){
    isMounted = false
  }



  render() {

    const treestyle = {
      width: "225px",
      backgroundColor: "#FFFFF0",
      borderRadius: "15px",
      boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      paddingLeft: "10px",
      paddingRight: "10px"
      }

        if(this.state.tree) {

            return (
              <div style={treestyle}>

                <Typography variant="h5" align="center" color="secondary"> {this.state.tree.name} </Typography>

                <IconButton onClick={() => 
                    {this.props.setViewTree(this.state.tree)
                    this.props.setPage("tree")}
                  } >
                  <Avatar src={this.state.tree.imageUrl}  alt=""  style={{ 
                    height: '200px', 
                    width: '200px'
                     }} />
                </IconButton>

                <br />
                <br />                

                {this.state.post ? 
                <Typography variant="h5" color="secondary"> {this.state.post.description} </Typography> :
                null}
              </div>
          
        )
        }

        else{

          return (
            <Typography variant="h3" color="secondary"> </Typography>
          )
          
        }
    
  }
}

export default PublicTreeCard
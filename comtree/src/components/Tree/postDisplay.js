import React from "react"
import firebase from "firebase/app"

import { Typography, Avatar } from "@material-ui/core"

class PostDisplay extends React.Component {

   constructor() {
    super()
    this.state = {
      comments: []
    }
  }


    componentDidMount() {

    firebase.firestore().collection("publicTrees").doc(this.props.treeId).collection("posts")
    .doc(this.props.postId).collection("comments").orderBy("timestamp", "desc")
    .onSnapshot((querySnapshot) => {

      let incomingComments = []

      querySnapshot.forEach(function(doc) {
        incomingComments.push(doc.data())
      })

      this.setState({
        comments: incomingComments
      })

    })

   }

   render() {
  
  
   const commentstyle = {
      backgroundColor: "#F0F8FF",
      borderRadius: "15px",
      border: "1px solid black",
      boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      padding: "10px",
      marginBottom: "10px"
   }


   let comments = this.state.comments

    return (
      <div>
        <div>
          
          <Typography variant="h5" color="secondary" > {this.props.post.description} </Typography>
          <img src={this.props.post.imageUrl} style={{ borderRadius: "15px", marginTop: 10 }} alt="" width="100%" /> 
          <Typography variant="h5" color="secondary"> {this.props.post.postedBy} </Typography>
          {this.props.post.timestamp ? 
          <Typography align="right" variant="h5" color="secondary"> {this.props.post.timestamp.toDate().toLocaleDateString()} </Typography> :
          null
          }
        </div>
        <div style={commentstyle} >
          {comments.length > 0 ? comments.map(comment => {

            let commentDate = ""
            let commentTime = ""
            
            if (comment.timestamp) {
              commentDate = comment.timestamp.toDate().toLocaleDateString()
              commentTime = comment.timestamp.toDate().toLocaleTimeString()
            } 

              return (
                <div key={comment.psudeoId}>

                {comments[0].psudeoId === comment.psudeoId ? null : <hr/>}
                

                <Typography 
                variant="body1" 
                color="secondary"
                style={{
                  display: "inline"
                }}
                > 
                <b>{comment.postedBy}:</b> {comment.comment} 
                </Typography>
                <br />
                {comment.exchangeAcorns > 0 ?
                <div style={{display: "inline-flex"}}>
                  <Typography variant="h6" color="secondary"> +{comment.exchangeAcorns} </Typography>
                  <Avatar variant="square" src="/heart.svg" alt="Algo" style={{ paddingBottom: "5px", height: "40px", width: "40px"}} />
                </div>
                :
                null
                }
                <Typography align="right" variant="body1" color="secondary"> {commentDate} </Typography>
                </div>
              )
            
            
          }) 
          :
          null 
          }
        </div>

      </div>
    )
   }

  }


export default PostDisplay
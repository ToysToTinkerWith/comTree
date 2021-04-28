import React from "react"

import { db } from "../firebase"

import { Typography } from "@material-ui/core"

class PostDisplay extends React.Component {

   constructor() {
    super()
    this.state = {
      comments: []
    }
  }


    componentDidMount() {

    db.collection("publicTrees").doc(this.props.treeId).collection("posts")
    .doc(this.props.postId).collection("comments").orderBy("timestamp", "desc")
    .get().then((querySnapshot) => {

      let incomingComments = []

      querySnapshot.forEach(function(doc) {
        incomingComments.push(doc.data())
      })

      this.setState({
        comments: incomingComments
      })

    })

   }

   componentDidUpdate(prevProps, prevState, snapshot) {

    if (this.state !== prevState) {

      db.collection("publicTrees").doc(this.props.treeId).collection("posts")
      .doc(this.props.postId).collection("comments").orderBy("timestamp", "desc")
      .get().then((querySnapshot) => {

        let incomingComments = []

        querySnapshot.forEach(function(doc) {
          incomingComments.push(doc.data())
        })

        this.setState({
          comments: incomingComments
        })

      })
    } 
  }

   render() {
  
  
   const commentstyle = {
      backgroundColor: "#F0F8FF",
      borderRadius: "15px",
      boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      paddingLeft: "10px",
      paddingRight: "10px"
   }


   let comments = this.state.comments

    return (
      <div>
        <hr />
        <div>
          <Typography variant="h4" color="secondary" > {this.props.post.description} </Typography>
          <img src={this.props.post.imageUrl} style={{ borderRadius: "15px" }} alt="" width="100%" /> 
          <Typography variant="h5" color="secondary"> Posted By: {this.props.post.postedBy} </Typography>
          {this.props.post.timestamp ? 
          <Typography align="right" variant="h5" color="secondary"> {this.props.post.timestamp.toDate().toLocaleDateString()} </Typography> :
          null
          }
        </div>
        <hr />
        <div style={commentstyle} >
          {comments.length > 0 ? comments.map(comment => {

            let commentDate = ""
            let commentTime = ""
            
            if (comment.timestamp) {
              commentDate = comment.timestamp.toDate().toLocaleDateString()
              commentTime = comment.timestamp.toDate().toLocaleTimeString()
            } 

            if (comment.imageUrl) {
              return (
                <div key={comment.psudeoId}>

                  {comments[0].psudeoId === comment.psudeoId ? null : <hr/>}
                  
                  <Typography variant="h6" color="secondary"> <b>{comment.postedBy}:</b> {comment.comment} </Typography>
                  <img src={comment.imageUrl} alt="" style={{ borderRadius: "15px" }} width="50%" />
                  <Typography align="right" variant="h6" color="secondary"> {commentDate + " @ " + commentTime} </Typography>
                  
                </div>
            )

            }

            else {
              return (
                <div key={comment.psudeoId}>

                {comments[0].psudeoId === comment.psudeoId ? null : <hr/>}

                <Typography variant="h6" color="secondary"> <b>{comment.postedBy}:</b> {comment.comment} </Typography>
                <Typography align="right" variant="h6" color="secondary"> {commentDate + " @ " + commentTime} </Typography>
                </div>
              )
            }
            
          }) :
          <Typography variant="h5" color="secondary" align="center"> No comments </Typography> }
        </div>
        <br />
        <br />
      </div>
    )
   }

  }


export default PostDisplay
import React from "react"
import { db } from "../firebase"
import firebase from "firebase"

import PostDisplay from "./postDisplay"
import Post from "./post"
import Comment from "./comment"
import TreeCare from "./treeCare"

import { Button, Typography, Avatar, IconButton } from "@material-ui/core"


let isMounted = false

class PublicTree extends React.Component {
  constructor() {
    super()
    this.state = {
      tree: null,
      treeId: null,
      posts: [],
      postIds: [],
      post: null,
      postId: null,
      status: "none"
    }

    this.hugTree = this.hugTree.bind(this)
  }

  componentDidMount() {
    isMounted = true
    db.collection("publicTrees").onSnapshot(snapshot => {
      let thisTree = null
      let thisId = null

      snapshot.docs.forEach(doc => {
        if(doc.data().psudeoId === this.props.psudeoId) {
          thisTree = doc.data()
          thisId = doc.id

          db.collection("publicTrees").doc(thisId).collection("posts")
          .orderBy("timestamp", "desc")
          .get().then((querySnapshot) => {

            let incomingPosts = []
            let incomingIds = []

            querySnapshot.forEach(function(doc) {
              incomingPosts.push(doc.data())
              incomingIds.push(doc.id)
            })

            if (isMounted) {
              this.setState({
                posts: incomingPosts,
                postIds: incomingIds,
              })
            }

          })
        }
      })
      
      if (isMounted) {
        this.setState({
          tree: thisTree,
          treeId: thisId
      })
      }
      
    })
  }

  componentWillUnmount(){
    isMounted = false
  }

  hugTree(uid) {

    if (uid) {
      db.collection("publicTrees").doc(this.state.treeId).update({
        huggedBy: firebase.firestore.FieldValue.arrayUnion(this.props.uid)
      })
    }

    else {
      db.collection("publicTrees").doc(this.state.treeId).update({
        huggedBy: firebase.firestore.FieldValue.arrayRemove(this.props.uid)
      })
    }


  }





  render() {

    const treestyle = {
      backgroundColor: "#FFFFF0",
      borderRadius: "15px",
      boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      paddingLeft: "10px",
      paddingRight: "10px",
      textAlign: "center"
      }

        if(this.state.tree) {

            return (
              <div style={treestyle}>

              

                <Typography variant="h4" align="center" color="secondary"> {this.state.tree.name} </Typography>
                <br />
                
                {this.state.tree.huggedBy.includes(this.props.uid) ? 
                <Button color="secondary" variant="outlined" onClick={() => {
                  this.hugTree(null)
                }} > Release </Button> :
                <Button color="secondary" variant="outlined" onClick={() => {
                  this.hugTree(this.props.uid)
                }} > Hug </Button>
                }

                <Button color="secondary" variant="outlined" onClick={() => {
                  this.state.status === "post" ? this.setState({status: "none"}) :
                  this.setState({status: "post"})
                }} > Post </Button>

                <Button color="secondary" variant="outlined" onClick={() => {
                  this.state.status === "tree" ? this.setState({status: "none"}) :
                  this.setState({status: "tree"})
                }} > Tree </Button>

                <br />
                <br />

                {this.state.status === "post" ?
                <Post treeId={this.props.psudeoId} username={this.props.username} uid={this.props.uid} /> : 
                null}

                {this.state.status === "tree" ?
                <TreeCare treeId={this.state.treeId} tree={this.state.tree} username={this.props.username} uid={this.props.uid} /> : 
                null}

                {this.state.posts.length > 0 ? this.state.posts.map((post, index) => {
                  return [<IconButton onClick={() => this.state.post ?
                  this.state.post.psudeoId === post.psudeoId ?
                    this.setState({post: null, postId: null}) : 
                    this.setState({post: post, postId: this.state.postIds[index]}) :
                    this.setState({post: post, postId: this.state.postIds[index]})
                  } >
          <Avatar src={post.imageUrl} alt="" style={{ height: '200px', width: '200px', float:"left" }} />
          </IconButton>]
                }) :
                null
                }

                <br />
                <br /> 
               

                {this.state.post ? 
                [<PostDisplay post={this.state.post} treeId={this.state.treeId} postId={this.state.postId} />,
                <Comment uid={this.props.uid} username={this.props.username} treeId={this.state.treeId} postId={this.state.postId} />]
 :
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

export default PublicTree
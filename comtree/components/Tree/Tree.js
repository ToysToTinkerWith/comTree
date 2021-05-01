import React from "react"
import firebase from "firebase/app"
import "firebase/firestore"

import PostDisplay from "./postDisplay"
import Post from "./post"
import Comment from "./comment"
import TreeCare from "./treeCare"

import { Button, Typography, Avatar, IconButton } from "@material-ui/core"

let isMounted = false

class Tree extends React.Component {
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
    firebase.firestore().collection("publicTrees").onSnapshot(snapshot => {
      let thisTree = null
      let thisId = null

      snapshot.docs.forEach(doc => {
        if(doc.data().psudeoId === this.props.tree.psudeoId) {
          thisTree = doc.data()
          thisId = doc.id

          firebase.firestore().collection("publicTrees").doc(thisId).collection("posts")
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
      firebase.firestore().collection("publicTrees").doc(this.state.treeId).update({
        huggedBy: firebase.firestore.FieldValue.arrayUnion(this.props.user.uid)
      })
    }

    else {
      firebase.firestore().collection("publicTrees").doc(this.state.treeId).update({
        huggedBy: firebase.firestore.FieldValue.arrayRemove(this.props.user.uid)
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
                
                {this.state.tree.huggedBy.includes(this.props.user.uid) ? 
                <Button color="secondary" variant="outlined" onClick={() => {
                  this.hugTree(null)
                }} > Release </Button> :
                <Button color="secondary" variant="outlined" onClick={() => {
                  this.hugTree(this.props.user.uid)
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
                <Post treeId={this.props.psudeoId} user={this.props.user} /> : 
                null}

                {this.state.status === "tree" ?
                <TreeCare treeId={this.state.treeId} tree={this.state.tree} /> : 
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
                <Comment user={this.props.user} treeId={this.state.treeId} postId={this.state.postId} />]
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

export default Tree
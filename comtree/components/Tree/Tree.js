import React from "react"
import firebase from "firebase/app"
import "firebase/firestore"

import PostDisplay from "./postDisplay"
import Post from "./post"
import Comment from "./comment"
import TreeCare from "./treeCare"
import EditTree from "./editTree"

import { Button, Modal, Typography, Avatar, IconButton } from "@material-ui/core"
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import EditIcon from '@material-ui/icons/Edit';
import FlagIcon from '@material-ui/icons/Flag';

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

              this.setState({
                posts: incomingPosts,
                postIds: incomingIds,
              })

          })
        }
      })
      
        this.setState({
          tree: thisTree,
          treeId: thisId
      })
      
    })
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

          if (this.props.user) {
            return (
              <div style={treestyle}>

                <Typography variant="h4" align="center" color="secondary"> {this.state.tree.name} </Typography>
                <br />

                <div style={{position: "absolute", top: 15, left: 15 }}>
                  <Typography variant="h6" color="Secondary"> 
                  <AccessibilityNewIcon />
                  {this.state.tree.huggedBy.length}
                  </Typography>
                </div>
                
                {this.state.tree.huggedBy.includes(this.props.user.uid) ? 
                <Button color="secondary" variant="outlined" onClick={() => {
                  this.hugTree(null)
                }} > Release </Button> :
                <Button color="secondary" variant="outlined" onClick={() => {
                  this.hugTree(this.props.user.uid)
                }} > Hug </Button>
                }

                <Button color="secondary" variant="outlined" onClick={() => {
                  this.setState({status: "post"})
                }} > Post </Button>

                <Button color="secondary" variant="outlined" onClick={() => {
                  this.setState({status: "tree"})
                }} > Tree </Button>

                {this.props.admins.includes(this.props.user.uid) ?
                  <Button color="secondary" variant="outlined" 
                  style={{
                    position: "absolute",
                    top: 15,
                    right: 15
                  }}
                  onClick={() => {
                    this.setState({status: "edit"})
                  }} >
                    <EditIcon />
                  </Button>
                  :
                  <Button color="secondary" variant="outlined" 
                  style={{
                    position: "absolute",
                    top: 15,
                    right: 15
                  }}
                  onClick={() => {
                    this.setState({status: "flag"})
                  }} >
                    <FlagIcon />
                  </Button>
  
                }

                
                <br />
                <br />

                {this.state.status === "post" ?
                <Modal 
                open={true} 
                onClose={() => this.setState({status: "none"})}
                style={{
                  marginTop: 50,
                  marginRight: 100,
                  marginBottom: 50,
                  marginLeft: 100,
                  overflowY: "auto",
                  overflowX: "hidden"
                }}>
                <Post treeId={this.props.psudeoId} user={this.props.user} />
                </Modal> 
                : 
                null}

                {this.state.status === "tree" ?
                <Modal 
                open={true} 
                onClose={() => this.setState({status: "none"})}
                style={{
                  marginTop: 50,
                  marginRight: 100,
                  marginBottom: 50,
                  marginLeft: 100,
                  overflowY: "auto",
                  overflowX: "hidden"
                }}>
                <TreeCare treeId={this.state.treeId} tree={this.state.tree} />
                </Modal> 
                : 
                null}

                {this.state.status === "edit" ?
                <Modal 
                open={true} 
                onClose={() => this.setState({status: "none"})}
                style={{
                  marginTop: 50,
                  marginRight: 100,
                  marginBottom: 50,
                  marginLeft: 100,
                  overflowY: "auto",
                  overflowX: "hidden"
                }}>
                <EditTree tree={this.state.tree} treeId={this.state.treeId} />
                </Modal> 
                : 
                null}

                {this.state.posts.length > 0 ? this.state.posts.map((post, index) => {
                  return [<IconButton onClick={() =>
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
                <Modal 
                open={true} 
                onClose={() => this.setState({post: null, postId: null})}
                style={{
                  marginTop: 50,
                  marginRight: 100,
                  marginBottom: 50,
                  marginLeft: 100,
                  overflowY: "auto",
                  overflowX: "hidden"
                }}>
                <div style={treestyle}>
                <PostDisplay post={this.state.post} treeId={this.state.treeId} postId={this.state.postId} />
                <Comment user={this.props.user} treeId={this.state.treeId} postId={this.state.postId} />
                </div>
                </Modal>
 :
                null}
              </div>
          
        )
          }

          else {
            return (
              <div style={treestyle}>

                <Typography variant="h4" align="center" color="secondary"> {this.state.tree.name} </Typography>
                <br />

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
                <Modal 
                open={true} 
                onClose={() => this.setState({post: null, postId: null})}
                style={{
                  marginTop: 50,
                  marginRight: 100,
                  marginBottom: 50,
                  marginLeft: 100,
                  overflowY: "auto",
                  overflowX: "hidden"
                }}>
                <div style={treestyle}>
                <PostDisplay post={this.state.post} treeId={this.state.treeId} postId={this.state.postId} />
                </div>
                </Modal>
                :
                null}
              </div>
          
        )
          }

            
        }

        else{

          return (
            <Typography variant="h3" color="secondary"> </Typography>
          )
          
        }
    
  }
}

export default Tree
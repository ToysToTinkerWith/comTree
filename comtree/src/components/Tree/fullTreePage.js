import React from "react"
import Post from "./post"
import PostDisplay from "./postDisplay"
import Comment from "./comment"
import { db } from "../firebase"

import { Typography } from "@material-ui/core"

let isMounted = false

class FullTreePage extends React.Component {
  constructor() {
    super()
    this.state = {
      posts: null,
      postIds: null
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {

    isMounted = true

    db.collection("publicTrees").doc(this.props.treeId).collection("posts")
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
          postIds: incomingIds
        })
      }

    })
             
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    if (this.state !== prevState) {

      db.collection("publicTrees").doc(this.props.treeId).collection("posts")
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
            postIds: incomingIds
          })

      })
    } 
  }
  

  componentWillUnmount(){
    isMounted = false
  }




  handleChange(event) {

    const {name, value} = event.target

    this.setState({[name]: value})
  }




  render() {

    const treestyle = {
        backgroundColor: "#FFFFF0",
      }

    const poststyle = {
      backgroundColor: "#FFFFF0",
      borderRadius: "15px",
      boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      paddingLeft: "10px",
      paddingRight: "10px"
    }


    

    if (this.state.posts) {

    let posts = this.state.posts

      return (
        <div style={treestyle}>

          <div>
            {this.props.uid === this.props.tree.owner ? 
            <Post postUpdate={this.postUpdate} username={this.props.username} treeId={this.props.tree.psudeoId} uid={this.props.uid} /> :
            null 
            }
          </div>

          <div>
            
            <br/>
              <Typography variant="h3" color="secondary" align="center"> Posts </Typography>
            <br />
            {posts.length > 0 ? posts.map((post, index) => {
              return [<div style={poststyle} key={post.psudeoId}>
              <br />
              <PostDisplay post={post} treeId={this.props.treeId} postId={this.state.postIds[index]}/>
              <br />
              <Comment uid={this.props.uid} username={this.props.username} post={post} treeId={this.props.treeId} postId={this.state.postIds[index]} />
              <br />
              </div>,
              <br />]
            }) :
              null}

          </div>

        </div>
      )

    }

    else {

      return (
        <div>
          <Typography variant="h4" color="secondary"> Loading... </Typography>
        </div>
      )

    }

  
    }

}

export default FullTreePage

import React from "react"
import firebase from "firebase/app"
import "firebase/firestore"

import TreeCard from "./TreeCard"

class MyTrees extends React.Component {
  constructor() {
    super()
    this.state = {
      myTrees: []
    }
  }

  componentDidMount() {
    firebase.firestore().collection("publicTrees").where("huggedBy", "array-contains", this.props.user.uid)
    .get()
    .then((querySnapshot) => {
        let myTrees = []
        querySnapshot.forEach((doc) => {
            myTrees.push(doc.data())
        })
        this.setState({
              myTrees: myTrees
            })

    })
    .catch(function(error) {
        console.log("Error getting documents: ", error)
    })
  }


  render() {

    let myTrees = this.state.myTrees

       return (
      <div>
        {myTrees.length > 0 ? myTrees.map(tree => {
          return (
            <div style={{display: "inline-block", paddingRight: 10, paddingBottom: 10 }} key={tree.psudeoId}>
            <TreeCard user={this.props.user} psudeoId={tree.psudeoId} setPage={this.props.setPage} setTree={this.props.setTree} />          

          </div>
          )
          
        }) :
        null}
      </div>
    )
}
  
}

export default MyTrees
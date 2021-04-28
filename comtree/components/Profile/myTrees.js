import React from "react"
import PublicTreeCard from "./publicTreeCard"
import { db } from "../firebase"

class MyTrees extends React.Component {
  constructor() {
    super()
    this.state = {
      myTrees: []
    }
  }

  componentDidMount() {
    db.collection("publicTrees").where("huggedBy", "array-contains", this.props.uid)
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
            <PublicTreeCard uid={this.props.uid} username={this.props.username} psudeoId={tree.psudeoId} setPage={this.props.setPage} setViewTree={this.props.setViewTree} />          

          </div>
          )
          
        }) :
        null}
      </div>
    )
}
  
}

export default MyTrees
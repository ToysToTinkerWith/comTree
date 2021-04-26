import React from "react"

import firebase from "firebase/app"
import "firebase/firestore"

import GoogleMapReact from 'google-map-react'
import Marker from "./Marker"

import { Avatar } from "@material-ui/core"

class Map extends React.Component {

   constructor() {
    super()
    this.state = {
      publicTrees: [],
      lat: 37,
      lng: -95,
      zoom: 1,
      currentLoc: {
        found: false,
        lat: 37,
        lng: -95
      }

    }
  }


  componentDidMount() {
    firebase.firestore().collection("publicTrees").onSnapshot(snapshot => {

      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords)
        this.setState({
          publicTrees: snapshot.docs.map(doc => doc.data()),
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          zoom: 10,
          currentLoc: {
            found: true,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
        })
      })

      this.setState({
        publicTrees: snapshot.docs.map(doc => doc.data())
      })

    })

  }


  render() {

    var displayTrees = this.state.publicTrees
    var width = this.state.zoom * 4

    return (
      <div>
        <div style={{ height: "100vh",  width: "100%" }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyBiB3iNngJM_kFWKxSv9a30O3fww7YTiWA"}}
            center={{lat: this.state.currentLoc.lat, lng: this.state.currentLoc.lng}}
            zoom={this.state.zoom}
            onChange={({ zoom }) => {
              this.setState({
                zoom: zoom
              })
            }
            }
          >

          

        {displayTrees.length > 0 ? displayTrees.map(tree => {
          return <Marker key={tree.psudeoId} width={width} uid={this.props.uid} lat={tree.latitude} lng={tree.longitude} setPage={this.props.setPage} setViewTree={this.props.setViewTree} tree={tree} />
        }) :  null }

        {this.state.currentLoc.found ?
          <h1> h1 </h1> :
          null
          }

          
          
          </GoogleMapReact>
        </div>
      </div>
  )
  }
    
    
  
}

export default Map;


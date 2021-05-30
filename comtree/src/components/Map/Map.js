import React from "react"

import firebase from "firebase/app"
import "firebase/firestore"

import GoogleMapReact from 'google-map-react'
import Marker from "./Marker"
import { Fab } from "@material-ui/core"

import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle';

const getMapOptions = (maps) => {

  return {
      streetViewControl: true,
      scaleControl: true,
      fullscreenControl: false,
      
      gestureHandling: "greedy",

      mapTypeControl: true,
      mapTypeId: maps.MapTypeId.SATELLITE,
      mapTypeControlOptions: {
          style: maps.MapTypeControlStyle.DROPDOWN_MENU,
          position: maps.ControlPosition.TOP_LEFT,
          mapTypeIds: [
              maps.MapTypeId.ROADMAP,
              maps.MapTypeId.SATELLITE,
              maps.MapTypeId.HYBRID
          ]
      },

      zoomControl: true,
      clickableIcons: false
  };
}

class Map extends React.Component {

   constructor() {
    super()
    this.state = {
      publicTrees: [],
      zoom: 4,
      lat: 37,
      lng: -95,
      found: false,
      currentLoc: {
        lat: 0,
        lng: 0
      }
    }
    this.getUserLocation = this.getUserLocation.bind(this)
  }


  componentDidMount() {
    firebase.firestore().collection("publicTrees").onSnapshot(snapshot => {

      this.setState({
        publicTrees: snapshot.docs.map(doc => doc.data())
      })

    })

  }

  getUserLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords)
      this.setState({
        zoom: 15,
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        found: true,
        currentLoc: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        
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
            options={getMapOptions}
            center={{lat: this.state.lat, lng: this.state.lng}}
            zoom={this.state.zoom}        
            onChange={({ zoom, center }) => {
              this.setState({
                zoom: zoom,
                lat: center.lat,
                lng: center.lng
              })
            }
            }    
          >

          

            {displayTrees.length > 0 ? displayTrees.map(tree => {
              return <Marker key={tree.psudeoId} width={width} user={this.props.user} lat={tree.latitude} lng={tree.longitude} setPage={this.props.setPage} setTree={this.props.setTree} tree={tree} />
            }) :  null }

            {this.state.found ? 
            <PersonPinCircleIcon lat={this.state.currentLoc.lat} lng={this.state.currentLoc.lng} style={{ width: width/2, height: width/2 }}/>
            :
            null
            }
            


          
          
          </GoogleMapReact>
          <Fab  color="primary" 
                tooltip="Location"
                style={{position: "absolute", top: 5, right: 75}}
                onClick={() => this.getUserLocation()}>
          <PersonPinCircleIcon />
          </Fab>
        </div>
        

      </div>
  )
  }
    
    
  
}

export default Map;


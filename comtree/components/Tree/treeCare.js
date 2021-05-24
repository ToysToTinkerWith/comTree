import React, { useState, useEffect } from 'react';
import firebase from "firebase/app"
import "firebase/firestore"

import { Formik, Form } from 'formik';
import { Button, Typography, TextField, Grid, makeStyles } from '@material-ui/core'
import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle';

import GoogleMapReact from 'google-map-react';
import UploadMarker from "../Upload/UploadMarker"

const getMapOptions = (maps) => {

  return {
      streetViewControl: false,
      scaleControl: true,
      fullscreenControl: false,
      disableDoubleClickZoom: true,
      
      gestureHandling: "greedy",
      mapTypeControl: true,
      mapTypeId: maps.MapTypeId.SATELLITE,
      mapTypeControlOptions: {
          style: maps.MapTypeControlStyle.HORIZONTAL_BAR,
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

const useStyles = makeStyles((theme) => ({
  
  error: {
    margin: theme.spacing(3),
    color: "red"
  },
  image: {
    margin: theme.spacing(3),
    width: '80%'
  },
  date: {
    margin: theme.spacing(3),
    width: '80%'
  },
  post: {
    backgroundColor: "#FFFFF0",
    borderRadius: "15px",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    padding: "10px",
    textAlign: "center"

  }
}))
 
function TreeCare(props) {

  const classes = useStyles()

  const [lat, setLat] = useState(0)
  const [lng, setLng] = useState(0)

  useEffect(() => {

    const unsubscribe = firebase.firestore().collection("publicTrees").onSnapshot(snapshot => {
  
          navigator.geolocation.getCurrentPosition((position) => {
            setLat(position.coords.latitude)
            setLng(position.coords.longitude)

          
        })
  
      })
  
      return () => {
        unsubscribe()
      }
  
    }, [])

  const handleUpdate = (formData) => {

    console.log(formData)

            firebase.firestore().collection("publicTrees").doc(props.treeId).update({
              watered: formData.watered,
              fert: formData.fert,
              weeded: formData.weeded,
              wiki: formData.wiki
            })

  }


  return (

    <div className={classes.post}>
    <Formik
      initialValues = {{ 
        watered: props.tree.watered,
        fert: props.tree.fert,
        weeded: props.tree.weeded,
        wiki: props.tree.wiki
    }}

    validate = {values => {
      const errors = {}

      return errors
    }}


      onSubmit = {(values, { setSubmitting }) => {
        setTimeout(() => {
          handleUpdate(values)
          setSubmitting(false)
        }, 400);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue
      }) => (
      <Form onSubmit={handleSubmit} autoComplete="off" >
      <br/>
      <div>

        <Grid container spacing={4}>
          <Grid item sm={12} md={5}>
            <TextField
              name="watered"
              label="Watered"
              type="date"
              defaultValue={props.tree.watered}
              className={classes.date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <br />
            <br />
            <TextField
              name="fert"
              label="Composted"
              type="date"
              defaultValue={props.tree.fert}
              className={classes.date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              name="weeded"
              label="Weeded"
              type="date"
              defaultValue={props.tree.weeded}
              className={classes.date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <br />
            <br />
            <div style={{ height: "50vh", width: "100%" }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyBiB3iNngJM_kFWKxSv9a30O3fww7YTiWA"}}
                options={getMapOptions}
                center={{lat : props.tree.latitude, lng : props.tree.longitude}}
                zoom={21}
              >

              <UploadMarker lat={props.tree.latitude} lng={props.tree.longitude} imageUrl={props.tree.imageUrl} />

              <PersonPinCircleIcon lat={lat} lng={lng} style={{ width: 25, height: 25 }} /> 


              </GoogleMapReact>
            </div>

          </Grid>
          <Grid item sm={12} md={7}>
          
           <TextField
              name="wiki"
              label="Wikipedia"
              type="text"
              defaultValue={props.tree.wiki}
              className={classes.date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <iframe
              title="Wiki"
              width="100%"
              height="640px"
              allow="fullscreen"
              src={props.tree.wiki}>
          </iframe>
        
          </Grid>
        </Grid>

        
      </div>      

      <Typography className={classes.error}> {errors.image} </Typography>


      <Button type="submit" color="secondary" variant="outlined" disabled={isSubmitting}> Update </Button>

      <br />
      <br />

      </Form>

      

      

      )}
    </Formik>
  </div>
)

}



export default TreeCare
import React from 'react';
import firebase from "firebase/app"
import "firebase/firestore"

import GoogleMapReact from 'google-map-react';
import UploadMarker from "../Upload/uploadMarker"

import { Formik, Form } from 'formik';
import { Button, TextField, Grid, makeStyles } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({
    
    name: {
        margin: theme.spacing(3),
        width: '60%'
    },
    edit: {
        backgroundColor: "#FFFFF0",
        borderRadius: "15px",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        paddingLeft: "10px",
        paddingRight: "10px",
        textAlign: "center"
    }
}))

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
 
export default function EditTree(props) {

    const classes = useStyles()

    const handleUpload = (formData) => {

        firebase.firestore().collection("publicTrees").doc(props.treeId).update({
            name: formData.name,
            latitude: formData.lat,
            longitude: formData.lng
        })

  }


  return (

    <div className={classes.edit}>
    <Formik
      initialValues = {{ 
        name: props.tree.name,
        lat: props.tree.latitude,
        lng: props.tree.longitude
    }}

    validate = {values => {
      const errors = {}
      

      return errors
    }}


      onSubmit = {(values, { setSubmitting, resetForm }) => {
        setTimeout(() => {
          handleUpload(values)
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
              <div>
              <TextField
                label="Name"
                name="name"
                defaultValue={props.tree.name}
                className={classes.name}
                onChange={handleChange}
                />
              </div>
            
          </Grid>
          <Grid item sm={12} md={7}>
          <div style={{ height: "50vh", width: "100%" }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyBiB3iNngJM_kFWKxSv9a30O3fww7YTiWA"}}
                options={getMapOptions}
                center={{lat : props.tree.latitude, lng : props.tree.longitude}}
                zoom={21}
                onClick={(event) => {

                  setFieldValue("lat", event.lat)
                  setFieldValue("lng", event.lng)
                  
                }}
              >

                <UploadMarker lat={values.lat} lng={values.lng} imageUrl={props.tree.imageUrl} />


              </GoogleMapReact>
            </div>
          </Grid>
        </Grid>
        
      </div>      

      <br />

      <Button type="submit" color="secondary" variant="outlined" disabled={isSubmitting}> Update </Button>

      <br />
      <br />

      </Form>


      )}
    </Formik>
  </div>
)

}

import React, { useState, useEffect } from 'react';
import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"

import GoogleMapReact from 'google-map-react';

import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle';

import { Formik, Form } from 'formik';
import { Button, Typography, Avatar, TextField, Input, CircularProgress, Grid, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({

  confirm: {
    color: "green"
  },
  error: {
    color: "red"
  },
  name: {
    width: '60%',
    margin: 25
  },
  description: {
    width: '90%',
    }
}))

const getMapOptions = (maps) => {

  return {
      streetViewControl: false,
      scrollwheel:false,
      scaleControl: true,
      fullscreenControl: false,
      disableDoubleClickZoom: true,
      
      gestureHandling: "greedy",
      mapTypeControl: true,
      mapTypeId: maps.MapTypeId.SATELLITE,
      mapTypeControlOptions: {
          style: maps.MapTypeControlStyle.DROPWDOWN_MENU,
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
 
function UploadTree(props) {

  const [progress, setProgress] = useState(0)
  const [confirm, setConfirm] = useState("")
  const [lat, setLat] = useState(37)
  const [lng, setLng] = useState(-95)
  const [zoom, setZoom] = useState(1)
  const [found, setFound] = useState(false)

  const classes = useStyles()

  const handleUpload = (formData) => {

    console.log(formData.image)

    let imgId = Math.random().toString(20)

    const uploadTask = firebase.storage().ref("images/" + imgId + "-" + props.user.uid).put(formData.image)

      uploadTask.on("state_changed", (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        setProgress(progress)
      },
      (error) => {
        alert(error.message)
      },
      () => {

        setConfirm("Tree upload success")
        let generatedId = Math.random().toString(36)

        firebase.storage().ref("images").child(imgId + "-" + props.user.uid).getDownloadURL().then(url => {
          firebase.firestore().collection("publicTrees").add({
            psudeoId: generatedId,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            latitude: formData.lat,
            longitude: formData.lng,
            name: formData.name,
            huggedBy: [props.user.uid],
            imageUrl: url,
            watered: null,
            fert: null,
            weeded: null,
            wiki: null,
            flag: ""
          }).then(doc => {
            firebase.firestore().collection("publicTrees").doc(doc.id).collection("posts").add({
              postedBy: props.user.displayName,
              postedbyId: props.user.uid,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              imageUrl: url,
              description: formData.description
            })
              
              props.setPage("")
            
          })
        })
      })

  }

  useEffect(() => {

        navigator.geolocation.getCurrentPosition((position) => {
          setLat(position.coords.latitude)
          setLng(position.coords.longitude)
          setZoom(15)
          setFound(true)
        
      })


  }, [])

  const uploadstyle = {
    backgroundColor: "#FFFFF0",
    borderRadius: "15px",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    paddingLeft: "10px",
    paddingRight: "10px",
    textAlign: "center"
  }


  return (

    <div style={uploadstyle}>
    <Formik
      initialValues = {{ 
        name: "",
        description: "",
        lat: 0,
        lng: 0,
        image: null
    }}

    validate = {values => {
      const errors = {}

      if (!values.name) {
          errors.name = "Tree name required"
        }
      
      if (values.name.length > 13) {
        errors.name = "Tree name must be 13 characters or less"
      }

      if (!values.description) {
          errors.description = "Please enter a description for the tree"
        }

      if (!values.image) {
          errors.image = "Upload an image for the tree"
        }
        
      if (values.lat === 0 && values.lng === 0) {
          errors.lat = "Click on the map to locate the tree"
        }
      
      setConfirm("")
      
      return errors
    }}


      onSubmit = {(values, { setSubmitting, resetForm }) => {
        setTimeout(() => {
          setConfirm("Uploading...")
          handleUpload(values)
          setSubmitting(false)
          resetForm({})

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
        /* and other goodies */
      }) => (
      <Form onSubmit={handleSubmit} autoComplete="off" >
      <br/>

      <Grid container >
          <Grid item xs={12} sm={6}>
            <div>
                <TextField
                  label="Tree Name"
                  name="name"
                  className={classes.name}
                  onChange={handleChange}
                />
                
                <TextField
                  label="Description"
                  name="description"
                  multiline
                  className={classes.description}
                  rows={8}
                  variant="outlined"
                  onChange={handleChange}
                />
              <Input style={{ margin: 25, width: "50%"}} name="image" type="file"
                onChange={(event) => {
                  setFieldValue("image", event.target.files[0])
                }} />
              
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <div style={{ height: "50vh", width: "100%" }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyBiB3iNngJM_kFWKxSv9a30O3fww7YTiWA"}}
                options={getMapOptions}
                center={{lat : lat, lng : lng}}
                zoom={zoom}
                onClick={(event) => {

                  setFieldValue("lat", event.lat)
                  setFieldValue("lng", event.lng)
                  
                }}
              >

                {found ? 
                  <PersonPinCircleIcon lat={lat} lng={lng} style={{ width: 25, height: 25 }} /> 
                  :
                  null
                }

                <Avatar lat={values.lat} lng={values.lng} src="/comtreesym.svg" alt="tree" />


              </GoogleMapReact>
            </div>
          </Grid>
      </Grid>
      <br />

      <Typography className={classes.error}> {errors.name} </Typography>
      <Typography className={classes.error}> {errors.description} </Typography>
      <Typography className={classes.error}> {errors.lat} </Typography>
      <Typography className={classes.error}> {errors.image} </Typography>
      <CircularProgress color="secondary" variant="determinate" value={progress} />
      <Typography className={classes.confirm}> {confirm} </Typography>

      <br />

      <Button type="submit" color="secondary" variant="outlined" disabled={isSubmitting}> Upload </Button>

      <br />
      <br />

      </Form>

      

      )}
    </Formik>
  </div>
)

}



export default UploadTree
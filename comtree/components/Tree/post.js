import React, { useState } from 'react';
import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"


import { Formik, Form } from 'formik';
import { Button, Typography, TextField, Input, CircularProgress, Grid, makeStyles } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({
  
  error: {
    margin: theme.spacing(3),
    color: "red"
  },
  image: {
    margin: theme.spacing(3),
    width: '80%'
  },
  description: {
    margin: theme.spacing(3),
    width: '80%'
  },
  post: {
    backgroundColor: "#FFFFF0",
    borderRadius: "15px",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    paddingLeft: "10px",
    paddingRight: "10px"
  }
}))
 
function Post(props) {

  const [progress, setProgress] = useState(0)
  const classes = useStyles()

  const handleUpload = (formData) => {

    console.log(formData)

    const uploadTask = firebase.storage().ref("images/" + formData.image.name + "-" + props.user.uid).put(formData.image)

      uploadTask.on("state_changed", (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        setProgress(progress)
      },
      (error) => {
        alert(error.message)
      },
      () => {
        firebase.storage().ref("images").child(formData.image.name + "-" + props.user.uid).getDownloadURL().then(url => {
          firebase.firestore().collection("publicTrees").where("psudeoId", "==", props.treeId).get()
            .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {

                firebase.firestore().collection("publicTrees").doc(doc.id).update({
                  imageUrl: url,
                }).then(
                  firebase.firestore().collection("publicTrees").doc(doc.id).collection("posts").add({
                  psudeoId: Math.random().toString(36),
                  postedBy: props.user.displayName,
                  postedbyId: props.user.uid,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  imageUrl: url,
                  description: formData.description
                })
                )

              })
            })
        })
      })

  }


  return (

    <div className={classes.post}>
    <Formik
      initialValues = {{ 
        description: "",
        image: null
    }}

    validate = {values => {
      const errors = {}

      if (!values.image) {
          errors.image = "Upload an image"
        }
      

      return errors
    }}


      onSubmit = {(values, { setSubmitting, resetForm }) => {
        setTimeout(() => {
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
      }) => (
      <Form onSubmit={handleSubmit} autoComplete="off" className={classes.root} >
      <br/>
      <div>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={7}>
            <TextField
            label="Description"
            name="description"
            multiline
            className={classes.description}
            rows={8}
            variant="outlined"
            onChange={handleChange}
          />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Input className={classes.image} id="image" name="image" type="file"
            onChange={(event) => {
              setFieldValue("image", event.target.files[0])
            }} />
            <CircularProgress variant="determinate" value={progress} />
          </Grid>
        </Grid>
        
      </div>      

      <Typography className={classes.error}> {errors.image} </Typography>


      <Button type="submit" color="secondary" variant="outlined" disabled={isSubmitting}> Post </Button>

      <br />
      <br />

      </Form>

      

      

      )}
    </Formik>
  </div>
)

}



export default Post
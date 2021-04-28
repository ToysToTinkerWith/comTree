
import React, { useState } from 'react';
import { db, storage } from "../firebase"
import firebase from "firebase"

import { Formik, Form } from 'formik';
import { Button, Typography, TextField, Input, CircularProgress, Grid, makeStyles } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#F0F8FF",
    borderRadius: "15px",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    paddingLeft: "10px",
    paddingRight: "10px"
  },
  error: {
    margin: theme.spacing(3),
    color: "red"
  },
  image: {
    margin: theme.spacing(3),
    width: '80%'
  },
  comment: {
    margin: theme.spacing(3),
    width: '80%',
  }
}))
 
function Comment(props) {

  const [progress, setProgress] = useState(0)
  const classes = useStyles()

  const handleUpload = (formData) => {

    if (formData.image) {

      const uploadTask = storage.ref("images/" + formData.image.name + "-" + props.uid).put(formData.image)

            uploadTask.on("state_changed", (snapshot) => {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
              setProgress(progress)
            },
            (error) => {
              alert(error.message)
            },
            () => {
              storage.ref("images").child(formData.image.name + "-" + props.uid).getDownloadURL().then(url => {
                db.collection("publicTrees").doc(props.treeId).collection("posts")
                .doc(props.postId).collection("comments").add({
                  imageUrl: url,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  postedBy: props.username,
                  postedById: props.uid,
                  comment: formData.comment,
                  psudeoId: Math.random().toString(36)

                })
              })
            })

    }

    else {

      db.collection("publicTrees").doc(props.treeId).collection("posts")
      .doc(props.postId).collection("comments").add({
        imageUrl: null,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        postedBy: props.username,
        postedById: props.uid,
        comment: formData.comment,
        psudeoId: Math.random().toString(36),

      })

    }

    

  }


  return (

    <div>
    <Formik
      initialValues = {{ 
        comment: "",
        image: null
    }}

    validate = {values => {
      const errors = {}

      if (!values.image && !values.comment) {
          errors.image = "Upload an image or a comment"
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
        /* and other goodies */
      }) => (
      <Form onSubmit={handleSubmit} autoComplete="off" className={classes.root} >
      <Grid container spacing={4}>
          <Grid item xs={12} sm={7}>
            <TextField
            label="Comment"
            name="comment"
            multiline
            className={classes.comment}
            rows={3}
            variant="outlined"
            onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Input className={classes.image} id="image" name="image" type="file"
            onChange={(event) => {
              setFieldValue("image", event.target.files[0])
            }} />
            <CircularProgress variant="static" value={progress} />
          </Grid>
        </Grid>
        
          <div>
            <br/>
           
          </div>

      <Typography className={classes.error}> {errors.image} </Typography>

      <Button type="submit" color="secondary" variant="outlined" disabled={isSubmitting}> Comment </Button>
      <br />
      <br />

      </Form>

      )}
    </Formik>
    <br />
  </div>
)

}



export default Comment


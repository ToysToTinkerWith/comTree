import React, { useState } from 'react';
import firebase from "firebase/app"
import "firebase/firestore"

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

      firebase.firestore().collection("publicTrees").doc(props.treeId).collection("posts")
      .doc(props.postId).collection("comments").add({
        imageUrl: null,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        postedBy: props.user.displayName,
        postedById: props.user.uid,
        comment: formData.comment,
        psudeoId: Math.random().toString(36),

      })

  }


  return (

    <div>
    <Formik
      initialValues = {{ 
        comment: ""
    }}

    validate = {values => {
      const errors = {}

      if (!values.comment) {
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
            <TextField
            label="Comment"
            name="comment"
            multiline
            className={classes.comment}
            rows={3}
            variant="outlined"
            onChange={handleChange}
            />
           

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


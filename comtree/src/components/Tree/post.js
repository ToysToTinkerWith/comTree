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
  confirm: {
    margin: theme.spacing(3),
    color: "green"
  },
  image: {
    width: '60%'
  },
  description: {
    width: '80%',
    marginBottom: 40
  },
  post: {
    backgroundColor: "#FFFFF0",
    borderRadius: "15px",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    paddingLeft: "10px",
    paddingRight: "10px",
    textAlign: "center"
  }
}))
 
function Post(props) {

  const [progress, setProgress] = useState(0)
  const [confirm, setConfirm] = useState("")
  const classes = useStyles()

  const handleUpload = (formData) => {

    console.log(formData)

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
        setConfirm("Post upload success")
        firebase.storage().ref("images").child(imgId + "-" + props.user.uid).getDownloadURL()
        .then(url => {
          firebase.firestore().collection("publicTrees").doc(props.treeId).update({
            imageUrl: url,
          }).then(
            firebase.firestore().collection("publicTrees").doc(props.treeId).collection("posts").add({
            psudeoId: Math.random().toString(36),
            postedBy: props.user.displayName,
            postedbyId: props.user.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            imageUrl: url,
            description: formData.description
          })
          )
          props.setStatus("")

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
      }) => (
      <Form onSubmit={handleSubmit} autoComplete="off" className={classes.root} >
      <br/>
      <div>

        <Grid container >
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
            <Input className={classes.image} id="image" name="image" type="file"
            onChange={(event) => {
              setFieldValue("image", event.target.files[0])
            }} />
          </Grid>
        </Grid>
        
      </div>      

      <Typography className={classes.error}> {errors.image} </Typography>
      <CircularProgress color="secondary" variant="determinate" value={progress} />
      <Typography className={classes.confirm}> {confirm} </Typography>



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
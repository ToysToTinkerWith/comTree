import React, { useState } from 'react';
import { db, storage } from "../firebase"

import { Formik, Form } from 'formik';
import { Button, TextField, Input, CircularProgress, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  
  root: {
      margin: theme.spacing(1),
      width: "90%"
  }
}))
 
function EditProfile(props) {

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
          db.collection("profiles").where("uid", "==", props.uid)
          .get()
          .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                  db.collection("profiles").doc(doc.id).update({
                    imageUrl: url,
                    bio: formData.bio
                  })
              })

          })
          .catch(function(error) {
              console.log("Error getting documents: ", error)
          })
              })

            }
        )
    }
    else {
      db.collection("profiles").where("uid", "==", props.uid)
          .get()
          .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                  console.log(doc.id, " => ", doc.data())
                  db.collection("profiles").doc(doc.id).update({
                    bio: formData.bio
                  })
              })

          })
          .catch(function(error) {
              console.log("Error getting documents: ", error)
          })

    }
  }


  const signupstyle = {
      backgroundColor: "#FFFFF0",
      borderRadius: "15px",
      boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      paddingLeft: "10px",
      paddingRight: "10px",
      marginLeft: "10px",
      marginRight: "10px"
  }

  return (

    <div style={signupstyle}>
    <Formik
      initialValues = {{ 
        bio: props.bio,
        image: null
    }}

    validate = {values => {
        const errors = {}

      return errors
    }}


      onSubmit = {(values, { setSubmitting }) => {
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
        /* and other goodies */
      }) => (
      <Form onSubmit={handleSubmit} className={classes.root} noValidate autoComplete="off" >
      <br />
      <TextField
          label="Bio"
          name="bio"
          defaultValue={props.bio}
          multiline
          className={classes.root}
          rows={8}
          variant="outlined"
          onChange={handleChange}
        />

        
      <div style={{marginLeft: 10}}>
        <Input id="image" name="image" type="file"
          onChange={(event) => {
            setFieldValue("image", event.target.files[0]);
          }} />
          <CircularProgress variant="static" value={progress} />

          <br/>
          <br/>

      </div>


      <Button type="submit" color="secondary" variant="outlined" disabled={isSubmitting}> Update </Button>
      <br />
      <br />

      </Form>

      )}
    </Formik>
  </div>
)

}



export default EditProfile
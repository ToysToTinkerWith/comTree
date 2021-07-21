import React, { useEffect, useState } from 'react';
import firebase from "firebase/app"
import "firebase/firestore"

import { Formik, Form } from 'formik';
import { Button, Typography, TextField, Avatar, makeStyles } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#F0F8FF",
    borderRadius: "15px",
    border: "1px solid black",
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

  const classes = useStyles()

  const [userAcorns, setUserAcorns] = useState(0)

  useEffect(() => {
    firebase.firestore().collection("profiles").where("uid", "==", props.user.uid)
    .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          setUserAcorns(doc.data().acorns)
            
        })
    });
  });

  const handleUpload = (formData) => {

      firebase.firestore().collection("publicTrees").doc(props.treeId).collection("posts")
      .doc(props.postId).collection("comments").add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        postedBy: props.user.displayName,
        postedById: props.user.uid,
        comment: formData.comment,
        psudeoId: Math.random().toString(36),
        exchangeAcorns: formData.exchangeAcorns

      })

      firebase.firestore().collection("profiles").where("uid", "==", props.user.uid)
      .get()
      .then((query) => {
        query.forEach((doc) => {
          firebase.firestore().collection("profiles").doc(doc.id).update({
            acorns: firebase.firestore.FieldValue.increment(-formData.exchangeAcorns)
          })
        })
        
      })

      firebase.firestore().collection("profiles").where("uid", "==", props.post.postedbyId)
      .get()
      .then((query) => {
        query.forEach((doc) => {
          firebase.firestore().collection("profiles").doc(doc.id).update({
            acorns: firebase.firestore.FieldValue.increment(formData.exchangeAcorns)
          })
        })
        
      })



  }


  return (

    <div>
    <Formik
      initialValues = {{ 
        comment: "",
        exchangeAcorns: 0
    }}

    validate = {values => {
      const errors = {}

      if (!values.comment) {
          errors.comment = "Upload a comment"
      }

      if (values.exchangeAcorns > userAcorns) {
        errors.comment = "Insufficient love"
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

            <br />



     <TextField 
     
     type="number"
     style={{ width: "50px"}} 
     defaultValue="0" 
     inputProps={{min: 0}}
     value={values.exhangeAcorns} 
     name="exchangeAcorns" 
     onChange={handleChange} 
     />
    <Avatar variant="square" src="/heart.svg" alt="Algo" style={{display: "inline-block", paddingBottom: "20px", height: "50px", width: "50px"}} />

    
      <Typography className={classes.error}> {errors.comment} </Typography>

      <Button type="submit" color="secondary" variant="outlined" disabled={isSubmitting}> Send </Button>
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


import React from 'react';
import firebase from "firebase/app"
import "firebase/firestore"


import { Formik, Form } from 'formik';
import { Button, TextField, makeStyles } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "#FFFFF0",
        borderRadius: "15px",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        paddingLeft: "10px",
        paddingRight: "10px",
        textAlign: "center"
    },
    flag: {
        margin: theme.spacing(3),
        width: '80%'
    },
    
}))

 
export default function FlagTree(props) {

    const classes = useStyles()

    const handleUpload = (formData) => {

        firebase.firestore().collection("publicTrees").doc(props.treeId).update({
            flag: formData.flag
        })

  }


  return (

    <div className={classes.root}>
    <Formik
      initialValues = {{ 
        flag: ""
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
      <TextField
            label="Describe reason for flag"
            name="flag"
            multiline
            className={classes.flag}
            rows={4}
            variant="outlined"
            onChange={handleChange}
        />    

      <br />

      <Button type="submit" color="secondary" variant="outlined" disabled={isSubmitting}> Flag </Button>

      <br />
      <br />

      </Form>


      )}
    </Formik>
  </div>
)

}

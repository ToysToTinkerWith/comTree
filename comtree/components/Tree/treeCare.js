import React from 'react';
import firebase from "firebase/app"
import "firebase/firestore"

import { Formik, Form } from 'formik';
import { Button, Typography, TextField, Grid, makeStyles } from '@material-ui/core'


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
    padding: "10px"

  }
}))
 
function TreeCare(props) {

  const classes = useStyles()

  const handleUpload = (formData) => {

    console.log(formData)

            firebase.firestore().collection("publicTrees").doc(props.treeId).update({
              watered: formData.watered,
              fert: formData.fert,
              wiki: formData.wiki
            })

  }


  return (

    <div className={classes.post}>
    <Formik
      initialValues = {{ 
        watered: props.tree.watered,
        fert: props.tree.fert,
        wiki: props.tree.wiki
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
      }) => (
      <Form onSubmit={handleSubmit} autoComplete="off" >
      <br/>
      <div>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={5}>
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

          </Grid>
          <Grid item xs={12} sm={7}>
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
          </Grid>
        </Grid>

        <iframe
              title="Wiki"
              width="100%"
              height="500px"
              allow="fullscreen"
              src={props.tree.wiki}>
          </iframe>
        
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
import React, { useState, useEffect } from "react"
import { GetServerSideProps } from "next";
import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";
import { createCheckoutSession } from "next-stripe/client";

import { Typography, Button, Grid, Modal, IconButton, Avatar, makeStyles } from "@material-ui/core"
import Image from "next/image"

const useStyles = makeStyles((theme) => ({
  item: {
    backgroundColor: "#FFFFF0",
    borderRadius: "15px",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    textAlign: "center"
  }
}))

interface IPrice extends Stripe.Price {
  product: Stripe.Product;
}

interface IProps {
  items: IPrice[];
}

export default function Store({ items }: IProps) {

  const [cart, setCart] = useState([])
  const [itemImg, setItemImg] = useState(null)

  const classes = useStyles()

  const addToCart = (item) => {

    let exists = false
    let existsIndex = 0

    cart.forEach((cartItem, index) => {
      if (cartItem.price === item.id) {
        exists = true
        existsIndex = index
      }
    })

    if (exists) {
      let newCart = [...cart]
      newCart[existsIndex].quantity = newCart[existsIndex].quantity + 1
      setCart(newCart)
    }

    else {
      setCart(prevState => [...prevState, { price: item.id, quantity: 1, tax_rates: ["txr_1InQh4Dj1xJ2OZeJzUlFjU1e"], product: item.product }])
    }
    
  }

  const removeFromCart = (item) => {

    let exists = false
    let existsIndex = 0

    cart.forEach((cartItem, index) => {
      if (cartItem.price === item.id) {
        exists = true
        existsIndex = index
      }
    })

    if (exists) {
      let newCart = [...cart]
      if (newCart[existsIndex].quantity === 1){
        newCart.splice(existsIndex, 1)
      }
      else {
        newCart[existsIndex].quantity = newCart[existsIndex].quantity - 1
      }
      setCart(newCart)
    }
    
  }

  const checkout = async (cart) => {
    const session = await createCheckoutSession({
      success_url: window.location.href,
      cancel_url: window.location.href,
      shipping_rates: ["shr_1InQi2Dj1xJ2OZeJRKTUeobv"],
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      line_items: cart,
      payment_method_types: ["card"],
      mode: "payment",
    });
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
    if (stripe) {
      stripe.redirectToCheckout({ sessionId: session.id });
    }
  };

  console.log(cart)

  return (
    
    <div>

      {itemImg ? 
        <Modal 
        open={true} 
        onClose={() => setItemImg(null)}
        style={{
          marginTop: 50,
          marginRight: 100,
          marginBottom: 50,
          marginLeft: 100,
          overflow: "scroll"
        }}>
          <img src={itemImg} alt="item" width="100%"/>

        </Modal>  
      :
        null
      }

      <Grid container>
        <Grid item className={classes.item} xs={12} sm={6}>
          {items.map((item) => (
            <div key={item.id}>
              <Typography variant="h4" color="secondary">{item.product.name}</Typography>
              <IconButton 
                onClick={() => {setItemImg(item.product.images[0])}}
              >
                <Avatar src={item.product.images[0]} style={{ width:50, height:50}} />
              </IconButton>
              <p>Cost: ${((item.unit_amount as number) / 100).toFixed(2)}</p>
              <Button variant="outlined" onClick={() => addToCart(item)}>Add</Button>
              <Button variant="outlined" onClick={() => removeFromCart(item)}>Remove</Button>
            </div>
          ))}
        </Grid>
        <Grid item className={classes.item} xs={12} sm={6}>

          {cart.length > 0 ? 
          [cart.map((item) => (
            <div key={item.price}>
              <Typography variant="h4" color="secondary"> {item.product.name} </Typography>
              <Typography variant="h4" color="secondary"> {item.quantity} </Typography>
              <img src={item.product.images[0]} alt="item" width={200}/>
            </div>
          )),
          <Button variant="outlined" onClick={() => checkout(cart)}>Checkout</Button>]
          :
          null
          }
          
        </Grid>
      </Grid>
      
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2020-08-27",
  });

  const prices = await stripe.prices.list({
    active: true,
    limit: 10,
    expand: ["data.product"],
  });

  return { props: { items: prices.data } };
};
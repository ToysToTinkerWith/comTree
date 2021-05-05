import React, { useState, useEffect } from "react"
import { GetServerSideProps } from "next";
import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";
import { createCheckoutSession } from "next-stripe/client";

interface IPrice extends Stripe.Price {
  product: Stripe.Product;
}

interface IProps {
  prices: IPrice[];
}

export default function Store({ prices }: IProps) {

  const [cart, setCart] = useState([])

  const addToCart = (priceId: string) => {

    let exists = false
    let existsIndex = 0

    cart.forEach((item, index) => {
      if (item.price === priceId) {
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
      setCart(prevState => [...prevState, { price: priceId, quantity: 1, tax_rates: ["txr_1InQh4Dj1xJ2OZeJzUlFjU1e"] }])
    }
    
  }

  const removeFromCart = (priceId: string) => {

    let exists = false
    let existsIndex = 0

    cart.forEach((item, index) => {
      if (item.price === priceId) {
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
      <h1>Items</h1>

      <ul>
        {prices.map((price) => (
          <li key={price.id}>
            <h2>{price.product.name}</h2>
            <img src={price.product.images[0]} style={{ width:50, height:50}} />
            <p>Cost: ${((price.unit_amount as number) / 100).toFixed(2)}</p>
            <button onClick={() => addToCart(price.id)}>Add</button>
            <button onClick={() => removeFromCart(price.id)}>Remove</button>
          </li>
        ))}
      </ul>

      <h1>cart</h1>
      {cart.length > 0 ? 
      cart.map((item) => {
        console.log(item)
        return <h1> {item.quantity} </h1>
      })
      :
      null
      }
        <button onClick={() => checkout(cart)}>Checkout</button>
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

  return { props: { prices: prices.data } };
};
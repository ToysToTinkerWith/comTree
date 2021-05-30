import React, { useState, useEffect } from "react"
import { GetServerSideProps } from "next";
import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";
import { createCheckoutSession } from "next-stripe/client";

import { Typography, Card, Button, Grid, Modal, IconButton, Fab, Avatar, makeStyles } from "@material-ui/core"
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

const useStyles = makeStyles((theme) => ({
  store: {
    backgroundColor: "#FFFFF0",
    textAlign: "center",
  },
  items: {
    display: "inline-flex",
    border: "1px solid black",
    borderRadius: "5px",
    margin: 10,
  },
  itemName: {
    color: "white",
    backgroundColor: theme.palette.secondary.main,
  },
  cart: {
    border: "1px solid black",
    borderRadius: "5px",
    margin: 10,
    padding: 10
  },
  cartItem: {
    display: "inline-flex",
    border: "1px solid black",
    borderRadius: "5px",
    margin: 10
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
  const [disCart, setDisCart] = useState([])
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
      setCart(prevState => [...prevState, { price: item.id, quantity: 1, tax_rates: ["txr_1IvmAxDj1xJ2OZeJnP9KtX1F"] }])
      setDisCart(prevState => [...prevState, { product: item.product } ])
    }
    
  }

  const removeFromCart = (item) => {

    let exists = false
    let existsIndex = 0

    cart.forEach((cartItem, index) => {
      if (cartItem.price === item.price) {
        exists = true
        existsIndex = index
      }
    })

    if (exists) {
      let newCart = [...cart]
      let newDisCart = [...disCart]
      if (newCart[existsIndex].quantity === 1){
        newCart.splice(existsIndex, 1)
        newDisCart.splice(existsIndex, 1)
        setCart(newCart)
        setDisCart(newDisCart)
      }
      else {
        newCart[existsIndex].quantity = newCart[existsIndex].quantity - 1
        setCart(newCart)
      }
      
      
    }
    
  }

  const checkout = async (cart) => {
    const session = await createCheckoutSession({
      success_url: "http://comtree.org/thanks",
      cancel_url: window.location.href,
      shipping_rates: ["shr_1IvmArDj1xJ2OZeJrk0vPH7k"],
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

  console.log(items)

  return (
    
    <div className={classes.store}>

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

      <Fab  color="primary" 
        style={{position: "absolute", top: 10, left: 10}}
        onClick={() => window.location.href = "http://comtree.org"}>
        <ArrowBackIcon />
      </Fab> 

      <svg width="200" height="auto" viewBox="0 0 399 234" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="ComtreeStore">
<g id="Comtree">
<path id="com" d="M39.4957 131.821L24.6157 132.589L5.89574 126.445L5.12774 102.733L13.2877 86.3165L26.8237 81.7085L37.1917 87.6605L32.0077 101.197L29.0317 99.6605L32.0077 90.7325L28.2637 87.6605L17.0317 92.9405L11.8477 104.845L13.2877 122.029L24.6157 126.445L37.1917 124.333L39.4957 131.821ZM59.3377 88.1405L50.8897 99.0845L52.7137 117.997L63.3697 128.077L70.5697 127.981L79.5937 110.317L75.5617 93.7085L69.1297 88.9085L59.3377 88.1405ZM72.3937 81.7085L82.5697 91.1165L86.4097 113.101L72.8737 134.317L59.4337 134.893L45.3217 117.901L44.2657 96.0125L56.2657 81.7085H72.3937ZM176.748 121.069L164.748 132.205L156.876 130.765L156.012 92.4605L150.156 88.8125L136.332 98.5085L137.1 102.445L138.06 126.925L142.86 129.229L142.38 131.533L124.812 132.013L125.196 129.517L129.996 127.213L129.42 94.7645L125.484 88.6205L116.844 92.7485L107.532 101.965L108.396 127.021L114.444 129.037L113.964 132.493L95.724 132.301L95.436 129.613L99.756 127.885L100.428 90.1565L93.132 85.2605L97.356 78.1565L105.516 84.6845L106.092 94.4765L118.668 84.4925L133.452 84.9725L135.18 93.9965L150.444 84.4925L160.524 86.2205L164.076 93.9965L162.636 125.485L165.228 125.677L172.524 115.981L176.748 121.069Z" fill="black"/>
<path id="ree" d="M273.702 92.6525L267.846 97.6445L262.758 90.2525L254.982 92.8445L252.678 97.9325L253.062 126.733L258.726 128.557L258.15 131.917H241.158L240.87 129.325L245.382 127.501L245.286 89.1005L240.582 86.4125L244.71 81.1325L251.718 85.6445L252.294 88.9085L257.19 86.9885L266.886 84.5885L273.702 92.6525ZM288.681 106.477L311.145 102.925L308.457 90.3485L302.025 87.9485L289.449 92.1725L288.585 106.861L288.681 106.477ZM308.169 83.9165L315.849 90.6365L318.633 107.149L288.585 111.949L293.769 127.213L305.097 126.925L318.537 122.893L319.305 130.477L292.233 134.317L280.425 116.845L281.769 92.1725L294.633 82.8605L308.169 83.9165ZM337.15 106.477L359.614 102.925L356.926 90.3485L350.494 87.9485L337.918 92.1725L337.054 106.861L337.15 106.477ZM356.638 83.9165L364.318 90.6365L367.102 107.149L337.054 111.949L342.238 127.213L353.566 126.925L367.006 122.893L367.774 130.477L340.702 134.317L328.894 116.845L330.238 92.1725L343.102 82.8605L356.638 83.9165Z" fill="black"/>
<g id="Comtreesym">
<g id="Layer 1">
<g id="Group">
<path id="Vector" d="M166.779 57.4841C166.51 57.2504 166.422 56.9367 166.272 56.6557C164.955 54.1982 163.989 51.6476 163.366 49.0137C163.08 47.8111 162.886 46.5971 162.739 45.3765C162.535 43.6559 162.513 41.9321 162.596 40.2099C162.669 38.7132 162.894 37.2247 163.207 35.7443C163.626 33.7722 164.234 31.8441 165.032 29.9552C166.081 27.4667 167.454 25.104 169.13 22.859C170.302 21.2871 171.609 19.7937 173.059 18.3901C174.509 16.9866 176.078 15.6794 177.77 14.467C180.926 12.204 184.399 10.3511 188.186 8.89687C191.445 7.64526 194.843 6.73842 198.375 6.17143C199.79 5.94431 201.216 5.78419 202.646 5.6502C203.227 5.59628 203.814 5.57014 204.399 5.55707C205.143 5.54073 205.885 5.47864 206.631 5.47864C208.091 5.47864 209.547 5.53419 210.997 5.6502C214.061 5.89366 217.07 6.37895 220.014 7.13547C222.41 7.75147 224.731 8.52269 226.966 9.46058C229.817 10.655 232.475 12.0929 234.954 13.7579C236.604 14.8673 238.134 16.0814 239.582 17.364C240.833 18.4735 241.974 19.663 243.039 20.8999C244.43 22.511 245.651 24.2054 246.701 25.9815C247.964 28.1236 248.974 30.3441 249.714 32.6496C250.196 34.1529 250.565 35.6725 250.815 37.2116C250.985 38.2574 251.092 39.3113 251.146 40.3684C251.182 41.0857 251.235 41.8047 251.203 42.5203C251.146 43.8357 251.057 45.1494 250.862 46.4598C250.471 49.1133 249.72 51.6934 248.649 54.2145C248.113 55.4727 247.48 56.6982 246.786 57.9024C246.288 57.4465 245.782 56.9972 245.29 56.5364C243.563 54.9171 241.839 53.2946 240.111 51.6754C238.636 50.2914 237.154 48.9107 235.678 47.5268C233.962 45.9173 232.251 44.303 230.533 42.6935C229.015 41.2704 227.49 39.8521 225.971 38.4306C224.189 36.7623 222.414 35.0924 220.633 33.4241C219.397 32.2657 218.157 31.1121 216.922 29.9536C214.922 28.0795 212.925 26.2037 210.927 24.3279C209.892 23.3557 208.866 22.377 207.819 21.4113C207.391 21.0159 207.002 20.5862 206.486 20.2136C205.83 20.8247 205.187 21.4178 204.55 22.0175C202.628 23.8263 200.71 25.6367 198.786 27.4455C197.344 28.8017 195.896 30.1546 194.454 31.5108C192.698 33.1611 190.945 34.8146 189.19 36.4649C188.019 37.5662 186.847 38.6659 185.677 39.7671C183.985 41.3602 182.295 42.955 180.603 44.5464C179.381 45.6968 178.151 46.8422 176.929 47.9925C175.206 49.6133 173.482 51.2375 171.76 52.86C170.518 54.0299 169.285 55.2064 168.029 56.3681C167.624 56.7455 167.269 57.1671 166.779 57.4841Z" fill="#A4BDA2"/>
<path id="Vector_2" d="M166.779 57.484C167.269 57.167 167.624 56.7438 168.033 56.3664C169.289 55.2046 170.52 54.0282 171.764 52.8583C173.486 51.2358 175.21 49.6116 176.933 47.9907C178.155 46.8404 179.385 45.695 180.607 44.5447C182.299 42.9533 183.989 41.3585 185.681 39.7654C186.851 38.6641 188.023 37.5645 189.194 36.4632C190.949 34.8113 192.702 33.1594 194.458 31.5091C195.9 30.1529 197.348 28.8 198.79 27.4438C200.712 25.635 202.632 23.8246 204.554 22.0158C205.191 21.4178 205.834 20.823 206.49 20.2119C207.006 20.5845 207.395 21.0142 207.823 21.4096C208.868 22.3736 209.896 23.354 210.931 24.3262C212.929 26.202 214.926 28.0778 216.926 29.9519C218.161 31.1104 219.401 32.264 220.637 33.4224C222.416 35.0907 224.193 36.7622 225.975 38.4289C227.494 39.852 229.019 41.2687 230.537 42.6918C232.254 44.3013 233.964 45.9156 235.682 47.5251C237.158 48.909 238.64 50.2897 240.115 51.6737C241.843 53.2929 243.565 54.9154 245.294 56.5347C245.786 56.9955 246.29 57.4464 246.79 57.9007C248.028 59.0722 249.265 60.2454 250.507 61.4153C251.247 62.113 251.995 62.8074 252.737 63.5035C252.838 63.5983 252.931 63.6963 253.092 63.8564C252.828 63.8564 252.661 63.8564 252.493 63.8564C249.575 63.8564 246.659 63.8581 243.741 63.8548C243.283 63.8548 242.823 63.9153 242.367 63.8336C242.303 63.6636 242.137 63.5558 242 63.4316C240.794 62.3221 239.586 61.2143 238.38 60.1049C236.573 58.4399 234.77 56.7716 232.963 55.105C231.844 54.0723 230.719 53.0413 229.6 52.0086C227.637 50.1949 225.677 48.3796 223.713 46.5676C222.499 45.4467 221.278 44.3307 220.064 43.2114C218.266 41.5562 216.473 39.8978 214.68 38.2409C213.762 37.3929 212.853 36.5384 211.925 35.6969C211.558 35.3652 211.227 35.0025 210.747 34.6577C210.747 34.8538 210.747 34.9812 210.747 35.107C210.747 37.2116 210.759 39.3161 210.737 41.419C210.733 41.7883 210.862 42.0579 211.157 42.3275C212.177 43.2588 213.177 44.2049 214.178 45.1493C215.87 46.7408 217.558 48.3371 219.25 49.9286C220.702 51.2946 222.16 52.6557 223.612 54.0233C225.493 55.7929 227.365 57.5657 229.245 59.3353C230.719 60.7209 232.197 62.1016 233.671 63.4872C233.776 63.5868 233.919 63.68 233.931 63.8368C233.861 63.845 233.814 63.8548 233.768 63.8548C230.229 63.8548 226.693 63.8548 223.154 63.8597C222.922 63.8597 222.777 63.7911 222.632 63.6505C221.867 62.9006 221.091 62.1587 220.317 61.4137C218.927 60.0738 217.535 58.734 216.146 57.3909C214.428 55.7308 212.715 54.0674 210.999 52.4073C210.943 52.3534 210.902 52.2635 210.751 52.306C210.751 52.4155 210.751 52.5315 210.751 52.6459C210.751 61.0885 210.751 69.5328 210.753 77.9754C210.753 78.1061 210.771 78.2352 210.779 78.3659C210.769 78.7581 210.747 79.1486 210.747 79.5407C210.745 94.9505 210.747 110.36 210.743 125.77C210.743 126.376 210.858 126.303 210.084 126.304C207.863 126.308 205.641 126.306 203.422 126.306C203.374 126.306 203.326 126.306 203.279 126.306C202.696 126.308 202.765 126.319 202.765 125.885C202.765 115.102 202.765 104.318 202.765 93.5355C202.765 88.869 202.765 84.204 202.763 79.5375C202.763 79.1453 202.747 78.7532 202.737 78.3627C202.745 78.2058 202.759 78.0506 202.759 77.8937C202.761 74.9787 202.759 72.0638 202.759 69.1488C202.759 63.6587 202.759 58.1686 202.757 52.6786C202.757 52.5462 202.799 52.4024 202.707 52.2684C202.537 52.3469 202.448 52.4563 202.345 52.5544C200.643 54.1573 198.941 55.7602 197.241 57.3631C196.239 58.3075 195.239 59.2536 194.238 60.198C193.026 61.3385 191.81 62.4757 190.602 63.6179C190.437 63.7747 190.267 63.8613 189.997 63.8613C186.601 63.8532 183.205 63.8564 179.809 63.8548C179.726 63.8548 179.613 63.8924 179.563 63.7617C179.948 63.3973 180.341 63.0215 180.738 62.6489C181.962 61.5003 183.187 60.3532 184.409 59.2029C186.069 57.6392 187.726 56.0739 189.386 54.5102C190.86 53.1246 192.339 51.7439 193.813 50.3583C195.537 48.7375 197.259 47.1133 198.98 45.4908C200.151 44.3895 201.321 43.2899 202.495 42.1918C202.682 42.017 202.769 41.834 202.769 41.5922C202.757 39.3962 202.763 37.2001 202.761 35.0041C202.761 34.9093 202.795 34.8031 202.676 34.6659C202.585 34.759 202.519 34.8309 202.448 34.8979C201.402 35.8799 200.357 36.8635 199.308 37.8423C197.953 39.1053 196.59 40.3618 195.235 41.6249C193.387 43.3471 191.542 45.0725 189.697 46.798C187.882 48.4924 186.071 50.19 184.255 51.8845C182.648 53.3828 181.033 54.8746 179.427 56.3713C177.272 58.3778 175.118 60.3826 172.972 62.3957C172.45 62.8859 171.893 63.3499 171.425 63.8777C167.69 63.8777 163.955 63.8777 160.232 63.8777C160.164 63.7028 160.307 63.6522 160.382 63.5819C162.37 61.7029 164.361 59.8271 166.349 57.9481C166.498 57.7977 166.635 57.6376 166.779 57.484Z" fill="black"/>
<path id="Vector_3" d="M210.775 78.3627C210.765 78.232 210.749 78.1029 210.749 77.9722C210.747 69.5296 210.747 61.0853 210.747 52.6427C210.747 52.5267 210.747 52.4123 210.747 52.3028C210.898 52.262 210.941 52.3518 210.995 52.4041C212.713 54.0642 214.426 55.7276 216.142 57.3877C217.531 58.7292 218.923 60.069 220.314 61.4105C221.085 62.1556 221.863 62.8974 222.628 63.6474C222.773 63.7879 222.918 63.8565 223.15 63.8565C226.689 63.8516 230.225 63.8532 233.764 63.8516C233.812 63.8516 233.857 63.8418 233.927 63.8336C233.915 63.6751 233.774 63.5836 233.667 63.484C232.195 62.0984 230.715 60.7177 229.242 59.3321C227.361 57.5625 225.487 55.7897 223.608 54.0201C222.156 52.6541 220.698 51.2914 219.246 49.9254C217.554 48.3339 215.866 46.7376 214.174 45.1461C213.171 44.2033 212.173 43.2556 211.154 42.3243C210.86 42.0563 210.729 41.7851 210.733 41.4158C210.755 39.3112 210.743 37.2067 210.743 35.1038C210.743 34.978 210.743 34.8506 210.743 34.6545C211.223 35.0009 211.556 35.362 211.921 35.6937C212.849 36.5352 213.758 37.3897 214.676 38.2377C216.469 39.8946 218.265 41.553 220.06 43.2082C221.276 44.3291 222.495 45.4435 223.709 46.5644C225.673 48.3764 227.633 50.1934 229.597 52.0054C230.715 53.0381 231.838 54.0691 232.959 55.1018C234.764 56.7684 236.569 58.4367 238.376 60.1017C239.58 61.2128 240.79 62.319 241.996 63.4284C242.133 63.5542 242.299 63.6604 242.363 63.8304C242.01 64.3451 241.526 64.7781 241.073 65.2307C239.984 66.3205 238.832 67.363 237.592 68.3368C235.208 70.2077 232.616 71.8498 229.797 73.255C226.716 74.7909 223.458 75.9935 220.024 76.8775C218.042 77.3873 216.027 77.7794 213.974 78.0441C212.913 78.1846 211.854 78.3317 210.775 78.3627Z" fill="#A4BDA2"/>
<path id="Vector_4" d="M171.419 63.8729C171.887 63.3451 172.444 62.8794 172.966 62.3909C175.11 60.3779 177.266 58.373 179.421 56.3665C181.027 54.8698 182.642 53.3764 184.249 51.8797C186.066 50.1869 187.876 48.4892 189.691 46.7932C191.538 45.0694 193.383 43.3439 195.23 41.6201C196.584 40.357 197.947 39.1005 199.302 37.8375C200.351 36.8587 201.396 35.8751 202.442 34.8931C202.513 34.8261 202.579 34.7542 202.67 34.6611C202.789 34.7967 202.755 34.9029 202.755 34.9993C202.757 37.1953 202.753 39.3914 202.763 41.5874C202.765 41.8292 202.676 42.0122 202.489 42.1871C201.315 43.2851 200.145 44.3847 198.974 45.486C197.251 47.1085 195.531 48.7327 193.807 50.3536C192.334 51.7392 190.854 53.1198 189.38 54.5054C187.72 56.0675 186.064 57.6345 184.403 59.1982C183.181 60.3485 181.956 61.4955 180.732 62.6442C180.335 63.0167 179.942 63.3909 179.557 63.7569C179.607 63.8876 179.72 63.85 179.803 63.85C183.199 63.8517 186.595 63.8484 189.991 63.8566C190.263 63.8566 190.431 63.77 190.596 63.6131C191.804 62.471 193.02 61.3337 194.232 60.1932C195.233 59.2488 196.233 58.3027 197.235 57.3583C198.935 55.7554 200.637 54.1509 202.339 52.5496C202.442 52.4532 202.531 52.3421 202.702 52.2637C202.793 52.3976 202.751 52.5398 202.751 52.6738C202.753 58.1639 202.753 63.6539 202.753 69.144C202.753 72.059 202.753 74.974 202.753 77.8889C202.753 78.0458 202.739 78.201 202.731 78.3579C200.962 78.2419 199.214 78.0082 197.483 77.6994C194.908 77.2386 192.403 76.5981 189.967 75.7681C186.478 74.5786 183.227 73.0492 180.204 71.1865C178.04 69.8515 176.066 68.345 174.226 66.7192C173.264 65.8696 172.361 64.9774 171.522 64.0428C171.478 63.9905 171.419 63.9464 171.419 63.8729Z" fill="#A4BDA2"/>
</g>
</g>
</g>
</g>
<path id="store" d="M143.461 171.416L151.525 174.728L154.405 171.92L157.501 174.08L152.029 181.424L149.437 178.976L137.629 176.168L133.813 180.632L138.781 187.616L153.253 191.216L155.269 203.456L145.765 209.36L133.093 206.48L131.365 209.432L127.765 208.784L130.213 201.224L144.901 204.68L149.437 201.296L147.709 195.248L132.301 189.992L128.125 181.424L131.581 173.432L143.461 171.416ZM185.124 206.768L173.316 209L167.7 203.456V196.04V177.464L164.244 178.04L161.436 178.688L160.932 175.232L166.044 173.576H167.052V166.808L166.044 164.504H172.164L172.74 170.768V173.072L182.82 171.848V177.464L172.74 176.96V200.648L176.124 204.464L185.124 202.808V206.768ZM200.1 175.952L193.764 184.16L195.132 198.344L203.124 205.904L208.524 205.832L215.292 192.584L212.268 180.128L207.444 176.528L200.1 175.952ZM209.892 171.128L217.524 178.184L220.404 194.672L210.252 210.584L200.172 211.016L189.588 198.272L188.796 181.856L197.796 171.128H209.892ZM251.006 179.336L246.614 183.08L242.798 177.536L236.966 179.48L235.238 183.296L235.526 204.896L239.774 206.264L239.342 208.784H226.598L226.382 206.84L229.766 205.472L229.694 176.672L226.166 174.656L229.262 170.696L234.518 174.08L234.95 176.528L238.622 175.088L245.894 173.288L251.006 179.336ZM262.241 189.704L279.089 187.04L277.073 177.608L272.249 175.808L262.817 178.976L262.169 189.992L262.241 189.704ZM276.857 172.784L282.617 177.824L284.705 190.208L262.169 193.808L266.057 205.256L274.553 205.04L284.633 202.016L285.209 207.704L264.905 210.584L256.049 197.48L257.057 178.976L266.705 171.992L276.857 172.784Z" fill="black"/>
</g>
</svg>



      <Grid container>
        <Grid item xs={12} sm={7}>
          {items.map((item) => (
            item.product.active === true ?
            <div key={item.id} className={classes.items}>
              <Card>
                <Typography variant="h6" className={classes.itemName} >{item.product.name}</Typography>
                <IconButton 
                  onClick={() => {setItemImg(item.product.images[0])}}
                >
                  <Avatar src={item.product.images[0]} style={{ width:100, height:100}} />
                </IconButton>
                <br/>
                <Typography variant="caption" style={{margin: 10}}>{item.product.description}</Typography>


                <Typography variant="h6">${((item.unit_amount as number) / 100).toFixed(2)}</Typography>
                <Button variant="outlined" onClick={() => addToCart(item)}>Add</Button>
              </Card>
              
            </div>
            :
            <></>
          ))}
        </Grid>
        <Grid item xs={12} sm={5}>
          <div className={classes.cart}>
          <ShoppingCartIcon fontSize="large"/>
          <br />
            {cart.length > 0 ? 
            [cart.map((item, index) => (
                <div key={item.price} className={classes.cartItem} >
                  <Card>
                  <Typography variant="h6" color="secondary" className={classes.itemName}> {disCart[index].product.name} </Typography>
                  <Avatar src={disCart[index].product.images[0]} alt="item" style={{ width:100, height:100, margin: 10}}/>
                  <Typography variant="h6"> {item.quantity} </Typography>
                  <Button variant="outlined" onClick={() => removeFromCart(item)}>Remove</Button>
                  </Card>
                </div>
              
            )),
            <br />,
            <Button variant="outlined" onClick={() => checkout(cart)}>Checkout</Button>]
            :
            null
            }
          </div>

          
          
        </Grid>
      </Grid>
      
    </div>
  );
}

export const getStaticProps = async () => {
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
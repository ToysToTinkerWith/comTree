import React from "react"
import firebase from "firebase/app"
import "firebase/firestore"

import algosdk from 'algosdk';
import MyAlgo from '@randlabs/myalgo-connect';

import EditProfile from "./EditProfile"
import MyTrees from "./MyTrees"

import { Typography, Button, Card, Grid, Modal, Avatar, IconButton, Input } from "@material-ui/core"
import PersonIcon from '@material-ui/icons/Person'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';


const myAlgoWallet = new MyAlgo()

class Profile extends React.Component {
  constructor() {
    super()
    this.state = {
      profile: null,
      editing: false,
      exchangeAcorns: 0
    }
    this.handleChange = this.handleChange.bind(this)
    this.connectToMyAlgo = this.connectToMyAlgo.bind(this)
    this.disconnectFromMyAlgo = this.disconnectFromMyAlgo.bind(this)
    this.buyAcorns = this.buyAcorns.bind(this)
    this.sellAcorns = this.sellAcorns.bind(this)
  }

  
  
  async connectToMyAlgo() {

  try {

    console.log(myAlgoWallet)

    const accounts = await myAlgoWallet.connect();

    const addresses = accounts.map(account => account.address);

    firebase.firestore().collection("profiles").where("uid", "==", this.props.user.uid)
    .get()
    .then((query) => {
      query.forEach((doc) => {
        firebase.firestore().collection("profiles").doc(doc.id).update({
          wallet: addresses[0]
        })
      })
      
    })

    console.log(addresses)
    
  } catch (err) {
    console.error(err);
  }
}

  disconnectFromMyAlgo() {
    firebase.firestore().collection("profiles").where("uid", "==", this.props.user.uid)
    .get()
    .then((query) => {
      query.forEach((doc) => {
        firebase.firestore().collection("profiles").doc(doc.id).update({
          wallet: null
        })
      })
      
    })
  }

  async buyAcorns(amount) {
    try {
      const algodClient = new algosdk.Algodv2('Algos', 'https://api.algoexplorer.io', '');
      const params = await algodClient.getTransactionParams().do();
        
      const txn = {
          ...params,
          type: 'pay',
          from: this.state.profile.wallet,
          to:  'Z3W4BTN5JQQ76AFQX2B2TGU3NPKGXF7TA7OJ4BYS4BK5FAITCED7AFRZXI',
          amount: amount * 1000000, // 1 algo * amount
          note: new Uint8Array(Buffer.from('...')),
      };
    
      const signedTxn = await myAlgoWallet.signTransaction(txn);
  
      await algodClient.sendRawTransaction(signedTxn.blob).do();

      firebase.firestore().collection("profiles").where("wallet", "==", this.state.profile.wallet)
      .get()
      .then((query) => {
        query.forEach((doc) => {
          firebase.firestore().collection("profiles").doc(doc.id)
          .update({
            acorns: firebase.firestore.FieldValue.increment(amount)
          })
        })
      })

    }
    catch(err) {
      console.error(err); 
    }
  }

  async sellAcorns(amount) {

    if (this.state.profile.acorns >= amount) {
      try {
        const algodClient = new algosdk.Algodv2('Algos', 'https://api.algoexplorer.io', '');
        const params = await algodClient.getTransactionParams().do();
          
        const txn = {
            ...params,
            type: 'pay',
            from: 'Z3W4BTN5JQQ76AFQX2B2TGU3NPKGXF7TA7OJ4BYS4BK5FAITCED7AFRZXI',
            to:  this.state.profile.wallet,
            amount: amount * 1000000, // 1 algo * amount
            note: new Uint8Array(Buffer.from('...')),
        };
  
        const passphrase = process.env.bankerAddress
  
        const bankerAccount = algosdk.mnemonicToSecretKey(passphrase)
      
        const signedTxn = algosdk.signTransaction(txn, bankerAccount.sk);
    
        await algodClient.sendRawTransaction(signedTxn.blob).do();
  
        firebase.firestore().collection("profiles").where("wallet", "==", this.state.profile.wallet)
        .get()
        .then((query) => {
          console.log(query)
          query.forEach((doc) => {
            firebase.firestore().collection("profiles").doc(doc.id)
            .update({
              acorns: firebase.firestore.FieldValue.increment(-amount)
            })
          })
        })
        
  
      }
      catch(err) {
        console.error(err); 
      }
    }

    
  }

  

   handleChange(event) {

    const {name, value} = event.target

    if (value >= 0) {
      this.setState({[name]: value})
    }

    
  }

  componentDidMount() {

    firebase.firestore().collection("profiles").where("uid", "==", this.props.user.uid)
    .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {

              this.setState({
              profile: doc.data(),
              editing: false
              })
            
            
        })
    });

  }


  render() {

   

      const profilestyle = {
        backgroundColor: "#FFFFF0",
        borderRadius: "15px",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        paddingRight: "10px",
        paddingTop: "10px",
        textAlign: "center"
      }

      const algostyle = {
        backgroundColor: "#A4BDA2",
        borderRadius: "15px",
        padding: "10px"
      }

      const shopstyle = {
        backgroundColor: "#F0FFF0",
        borderRadius: "15px",
        padding: "10px"
      }

      console.log(this.state.exchangeAcorns)

    if (this.state.profile) {

      return (
      <div style={profilestyle}>
        <div style={{ textAlign: "center" }}>

          <Grid container>
            <Grid item xs={12} sm={8}>
              {this.state.profile.imageUrl ? 
              <IconButton onClick={() => this.setState({
                editing: !this.state.editing
              })} >
              <Avatar src={this.state.profile.imageUrl} alt="" style={{ height: "60px", width: "60px", display: "inline-block" }} />
              </IconButton> 
              :
              <IconButton onClick={() => this.setState({
                editing: !this.state.editing
              })} >
              <PersonIcon style={{ height: "60px", width: "60px", display: "inline-block" }} />
              </IconButton>
              }
              <Typography variant="h4" style={{ display: "inline-block", paddingTop: "10px" }} color="secondary"> {this.state.profile.username} </Typography>
              <Typography variant="subtitle1" align="center" color="secondary"> {this.state.profile.bio} </Typography>
              
              <Avatar variant="square" src="/heart.svg" alt="Algo" style={{ display: "inline-block", height: "60px", width: "60px" }} />
              <Typography variant="h6" color="secondary" style={{display: "inline-block"}}> {this.state.profile.acorns} </Typography>


            </Grid>
            <Grid item xs={12} sm={4}>

              <Card style={algostyle}>
                  
                {this.state.profile.wallet ?
                <Card style={shopstyle}>
                  <Button variant="outlined"  onClick={() => this.disconnectFromMyAlgo()}>
                  <Avatar variant="square" src="/algorand.svg" alt="Algo" style={{ height: "30px", width: "30px" }} />
                  <Typography variant="caption"  style={{marginLeft: 5}}> Disconnect </Typography>
                  </Button>
                  <br />

                  <div style={{ display: "inline-flex"}}>
                  <Avatar variant="square" src="/algorand.svg" alt="Algo" style={{ marginTop: "10px", marginRight:"5px", height: "20px", width: "20px" }} />
                  <Typography  variant="h6" > = </Typography>
                  <Avatar variant="square" src="/heart.svg" alt="Algo" style={{height: "40px", width: "40px"}} />

                  </div >
                  <br />
                  <div style={{display: "inline-flex", margin: "10px"}}>

                  <Input 
                  type="number" 
                  style={{ width: "50px"}} 
                  defaultValue="0" 
                  inputProps={{min: 0}} 
                  value={this.state.exchangeAcorns} 
                  name="exchangeAcorns" 
                  onChange={this.handleChange} 
                  />

                  <Avatar variant="square" src="/heart.svg" alt="Algo" style={{height: "40px", width: "40px"}} />

                  </div>
                  

                 <div >
                 
                  <Button variant="outlined" onClick={() => this.buyAcorns(this.state.exchangeAcorns)}>
                  buy
                  </Button>
                  <Button variant="outlined" onClick={() => this.sellAcorns(this.state.exchangeAcorns)}>
                  sell
                  </Button>
                 </div>

                 

                 

                  
                  
                </Card>
                
                
                :
                <Card style={shopstyle}>
                  <Button variant="outlined"  onClick={() => this.connectToMyAlgo()}>
                  <Avatar variant="square" src="/algorand.svg" alt="Algo" style={{ height: "30px", width: "30px" }} />
                  <Typography variant="caption"  style={{marginLeft: 5}}> Connect </Typography>
                  </Button>                  
                </Card>
                }            
              </Card>

              
              
            </Grid>
          </Grid>

          

          
        </div>

        {this.state.editing ? 
          <Modal 
          open={true} 
          onClose={() => this.setState({editing: false})}
          style={{
            marginTop: 75,
            overflowY: "auto",
            overflowX: "hidden"
          }}>
          <EditProfile bio={this.state.profile.bio} setEdit={this.setEdit} user={this.props.user}/>
          </Modal>
          :
          null }
          
        <br />
        <hr/>
        <MyTrees user={this.props.user} setPage={this.props.setPage} setTree={this.props.setTree} />
      </div>
      )
      
    }

    else {

      return (
        <div>
          <Typography variant="h2" align="left" color="secondary">  </Typography>
        </div>
      )

    }
    
  }
}

export default Profile
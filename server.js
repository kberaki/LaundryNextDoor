'use strict'
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const superagent = require('superagent')
require('dotenv').config()
const PORT = process.env.PORT || 3000
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoURL = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ds147872.mlab.com:47872/md301`

const db = mongoose.connection
const providerSchema = new mongoose.Schema({
  name: String,
  email: String,
  address:String,
  zip: Number,
  city:String
 })

const Provider =mongoose.model('Provider',providerSchema)

mongoose.connect(mongoURL)

const laundarySchema = new mongoose.Schema({
  fullName: String,
  emailAddress: String,
  phoneNumber: Number, 
  address: String,
  state:String,
  City:String,
  zipcode: Number
})

const User = mongoose.model("User", laundarySchema)

const orderSchema = new mongoose.Schema({
  fullName: String,
  emailAddress: String,
  phoneNumber: Number,
  address: String,
  state:String,
  City:String,
  specialAtt:String,

})
const Order = mongoose.model("Order", orderSchema)

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

app.use(express.static('public'))
app.use(express.static('images'))
app.get('/', (req, res) => {
  res.render('pages/index')
})

app.get('/post-orderForm', (req, res)=>{
  res.render('pages/order-form')
})
app.get("/signupForm", (req, res) => {
  res.render("pages/signup.ejs")
 });
 app.get('/provider-form', (req, res)=>{
  res.render('pages/provider-form')
 })
 app.post('/provider-form', (req,res)=>{
 // console.log('Check')
  const providerData= new Provider({
    name: req.body.FirstName,
    email:req.body.email,
    address:req.body.address,
    city: req.body.city,
    zip:req.body.zip
 })
 providerData.save()
  .then(item => {
    res.send("You have successfully signed up");
    })
    .catch(err => {
    res.status(400).send(" Error occuried please check your data")
    });
 })

 app.post("/signupForm", (req, res) => {
  const userData = new User({
    fullName : req.body.name,
    emailAddress:req.body.email,
    phoneNumber:req.body.phone,
    address:req.body.address,
    state:req.body.state,
    City:req.body.City,
    zipcode:req.body.zipcode,
  });
  userData.save()
  .then(item => {
  res.send("Thank you! You have successfully signed up as customer");
  })
  .catch(err => {
  res.status(400).send(" Error occuried please check your data")
  });
});

let orig =[]
Order.find({},(err, originaddr)=>{
orig.push(originaddr[originaddr.length-1].address)
console.log(orig.toString())
})
  let dest =[]
Provider.find({}, (err, addr)=>{
  for(let i=0; i<addr.length; i++){
  dest.push(addr[i].address) 
}
})

app.post("/post-orderForm", (req, res) => {
  const orderData = new Order({
    fullName : req.body.name,
    emailAddress:req.body.email,
    phoneNumber:req.body.phone,
    address:req.body.address,
    state:req.body.state,
    City:req.body.city,
    specialAtt:req.body.attention
  });
  orderData.save()
  const url =`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${orig}&destinations=${dest[0]}|${dest[1]}|${dest[2]}|${dest[3]}&key=${process.env.GOOGLE_API_KEY}`
  superagent.get(url)
  .then(result=>{
    let arr = new Distance(result)

    let ss 
    let ss2
    let min2=[]
    for(let i=0; i<arr.dis.length; i++){
      ss= parseFloat(arr.dis[i].distance.text)
      ss2= arr.dis[i].duration.text
      min2.push({ss, ss2})    
    }

    let dur = []
    let mom
    for(let i=0; i<min2.length; i++){
      dur.push(min2[i].ss)
      if(Math.min(dur)){
      mom = `You are ${min2[i].ss} miles away and our nearest service provider will arrive in ${min2[i].ss2}`
      }
    }
    console.log(mom)
    res.send(mom)

  })

  .catch(err=>res.send(err))
})


app.post('/provider-form', function(req,res){
  // console.log('Check')
  const providerData= new Provider({
    name: req.body.FirstName,
    email:req.body.email,
    address:req.body.address,
    city: req.body.city,
    zip:req.body.zip
 })
 providerData.save()
 .then(item=>{
  res.send("Thank you! You have successfully signed up as provider");
 })
 .catch(err => {
  res.status(400).send(" Error occuried please check your data")
  });
});


app.use(express.urlencoded({ extended: true }))
//when adding css files, put them in a public folder and include this line of code


app.set('view engine', 'ejs')

const Distance= function(dis, dur){
  this.dis=dis.body.rows[0].elements
  // this.dur=dis.body.rows[0].elements[0].duration.text 
}

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

app.use('*', (req, res) => {
  res.send('Something broke')
})


db.on('error', console.error.bind(console, 'Connection error'))
db.once('open', () => console.log('db connection open!'))
// db.Order.update({username: "tom"}, {$pull: {documents: {$exists: true}}})







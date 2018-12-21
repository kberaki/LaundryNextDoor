'use strict'

const express = require('express')
const app = express()
const superagent = require('superagent')
//const { Schema, model } = require('mongoose')
require('dotenv').config()
const PORT = process.env.PORT || 3000
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose')
// mongoose.Promise = global.Promise;mongoose.connect("mongodb://localhost:27017/LaundryNextDoor");

const laundarySchema = new mongoose.Schema({
  fullName: String,
  emailAddress: String,
  phoneNumber: Number,
  address: String,
  state:String,
  City:String,
  zipcode: Number,
  //

})
const User = mongoose.model("User", laundarySchema)

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
  res.send("You have successfully signed up");
  })
  .catch(err => {
  res.status(400).send(" Error occuried please check your data")
  });
});

 const providerSchema = new mongoose.Schema({
  name: String,
  email: String,
  zip: Number,
  city:String
 })
 
 app.post('/provider-form', function(req,res){
  console.log('Check')
  new Provider({
    name: req.body.FirstName,
    email:req.body.email,
    city: req.body.city,
    zip:req.body.zip
 }).save(function(err, Provider){
   if(err) {
     console.log('Error')
   }
   else res.send('Successful')
 })
 })
//  app.use('*', (req, res) => {
//   res.send('Something broke')
//  })


app.use(express.urlencoded({ extended: true }))
//when adding css files, put them in a public folder and include this line of code
app.use(express.static('public'))

app.set('view engine', 'ejs')

// app.get('/', (req, res) => {
//    res.render('pages/index')
// })

//let destinations='SilverSpring,Md'
//let origins='Washington,DC'
app.get('/order', (req, res) => {
  const url =`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${req.query.origins}&destinations=${req.query.destinations}&key=${process.env.GOOGLE_API_KEY}`
  superagent.get(url)
  .then(result=>{
    res.send(new Distance(result))
  })
  .catch(err=>res.send(err))
})

const Distance= function(dis){
  this.dis=dis.body.rows[0].elements[0].distance.text,
  this.dur=dis.body.rows[0].elements[0].duration.text
}

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

app.use('*', (req, res) => {
  res.send('Something broke')
})

 const Provider =mongoose.model('Provider',providerSchema)

const mongoURL = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ds147872.mlab.com:47872/md301`

mongoose.connect(mongoURL)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'Connection error'))
db.once('open', () => console.log('db connection open!'))


// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`)})


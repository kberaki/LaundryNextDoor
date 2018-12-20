'use strict'

const express = require('express')
const superagent = require('superagent')
const { Schema, model } = require('mongoose')
const mongoose = require('mongoose')
// const bodyParse=require('body-parser')
// const path = require('path')

require('dotenv').config()

const mongoURL = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ds147872.mlab.com:47872/md301`

mongoose.connect(mongoURL)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'Connection error'))
db.once('open', () => console.log('db connection open!'))

const PORT = process.env.PORT || 3000

const app = express()

// app.use(bodyParse.urlencoded({extended: false}))
// app.use(express.static(path.resolve(__dirname, 'public')))

// app.post('/post-orderForm', function(req, res){
//   dbConn.then(function(db){
//     db.collection('orderForm'), insertone(req.body)
//   })
//   res.send('Thank you! data recieved')
// })

app.use(express.urlencoded({ extended: true }))
//when adding css files, put them in a public folder and include this line of code
app.use(express.static('public'))

app.set('view engine', 'ejs')


app.get('/', (req, res) => {
  //console.log("<h1>THis is the main page</h1>")
   res.render('pages/index')
})

// app.get('/order-form', nearestLoc)
// // app.post('/collection', collectionHandler)

app.get('/post-orderForm', (req, res)=>{
  res.render('pages/order-form')
})


app.use('*', (req, res) => {
  res.send('Something broke')
})
// destinations=SilverSpring,Md
// origins=Washington,DC
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

function nearestLoc(req, res) {
  let url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&${req.query.origins}&${req.query.destinations}&${key=GOOGLE_API_KEY}`
  req.query.param === 'distance' ? url += `indistance:${req.query.distanceSearch}` : url += `induration:${req.query.distanceSearch}`
  superagent.get(url)
    .then(laundry => {
      let laundryArr = []
      for(let i = 0; i < 10; i++) {
        laundryArr.push(new Book(laundry.body.rows[i]))
      }
      res.render('pages/order-form', { bookList: laundryArr })
     })
    .catch(err => res.send('something broke'))
}


const Laundry = function(laundry) {
  this.distance = laundry.element.distance
  this.duration = laundry.element.duration ? laundry.element.duration[0] : 'none'
}

const laundarySchema = new Schema({
  distance: String,
  duration: String,
})

const ordercoll = model('ordercoll', laundarySchema)


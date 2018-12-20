'use strict'

const express = require('express')
const superagent = require('superagent')
const { Schema, model } = require('mongoose')
const mongoose = require('mongoose')


require('dotenv').config()

const mongoURL = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ds147872.mlab.com:47872/md301`

mongoose.connect(mongoURL)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'Connection error'))
db.once('open', () => console.log('db connection open!'))

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.urlencoded({ extended: true }))
//when adding css files, put them in a public folder and include this line of code
app.use(express.static('public'))

app.set('view engine', 'ejs')


app.get('/', (req, res) => {
   res.render('pages/index')
})

let destinations='SilverSpring,Md'
let origins='Washington,DC'
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




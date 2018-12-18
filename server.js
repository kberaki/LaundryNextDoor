'use strict'

const express = require('express')
const superagent = require('superagent')
const { Schema, model } = require('mongoose')
const mongoose = require('mongoose')


require('dotenv').config()

const mongoURL = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ds147872.mlab.com:47872/md301`

mongoose.connect(mongoUrl)

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

app.get('/search', searchHandler)
app.post('/collection', collectionHandler)

app.use('*', (req, res) => {
  res.send('Something broke')
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

function searchHandler(req, res) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=+'
  req.query.param === 'title' ? url += `intitle:${req.query.bookSearch}` : url += `inauthor:${req.query.bookSearch}`
  superagent.get(url)
    .then(books => {
      let booksArr = []
      for(let i = 0; i < 10; i++) {
        booksArr.push(new Book(books.body.items[i]))
      }
      res.render('pages/searchResults', { bookList: booksArr })
    })
    .catch(err => res.send('something broke'))
}

function collectionHandler (req, res) {
  console.log(req.body)
  const newBook = new BookShelf({
    title: req.body.title,
    author: req.body.author,
    comments: req.body.comments
  })
  newBook.save()
    .then(result => {
      console.log(result)
      BookShelf.find({}, (err, books) => {
        console.log('books', books)
        res.render('pages/collection', {collection: books})
      })
    })
}

const Book = function(book) {
  this.title = book.volumeInfo.title
  this.author = book.volumeInfo.authors ? book.volumeInfo.authors[0] : 'none'
}

const BookSchema = new Schema({
  title: String,
  author: String,
  comments: String
})

const BookShelf = model('BookShelf', BookSchema)

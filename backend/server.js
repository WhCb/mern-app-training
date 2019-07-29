require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const logger = require('morgan')
const Data = require('./data')

const API_PORT = process.env.API_PORT
const app = express()

app.use(cors())

const router = express.Router()

console.log(process.env.API_PORT)
console.log(process.env.MONGODB_URI)

// Connects our BE code to db
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true})

let db = mongoose.connection

db.once('open', () => console.log('connected to the db'))

// checks whether the db connection is successful
db.on('error', console.error.bind(console, 'MongoDB connection error: '))

// bodyParser is for request body json parse
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Logging
app.use(logger('dev'))

// Data fetch endpoint
router.get('/getData', (req, res) => {
  Data.find((err, data) => {
    if (err) { return res.json({ success: false, error: err }) }

    return res.json({ success: true, data })
  })
})

// Update data endpoint
router.post('/updateData', (req, res) => {
  const { id, update } = req.body

  Data.findByIdAndUpdate(id, update, (err) => {
    if (err) { return res.json({ success: false, error: err }) }

    return res.json({ success: true })
  })
})

// Delete data endpoint
router.post('/deleteData', (req, res) => {
  const { id } = req.body

  console.log('id: ', id)

  Data.findByIdAndRemove(id, (err) => {
    console.log('err: ', err)

    if (err) { return res.send(err) }

    return res.json({ success: true })
  })
})

// Create data endpoint
router.post('/putData', (req, res) => {
  let data = new Data()

  const { id, message } = req.body

  if ((!id && id !== 0) || !message) {
    return res.json({ success: false, error: 'INVALID INPUTS' })
  }

  data.message = message
  data.id = id

  data.save((err) => {
    if (err) { return res.json({ success: false, error: err })}

    return res.json({ success: true })
  })
})

// append api for our http requests
app.use('/api', router)

// Launch BE on the port
app.listen(process.env.API_PORT, () => { console.log(`Listening on port ${process.env.API_PORT}`) })
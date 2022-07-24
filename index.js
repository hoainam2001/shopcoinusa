require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const userRouter = require('./routes/user')
const bodyParser = require('body-parser')

const app = express()


app.set('view engine', 'ejs')
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

mongoose.connect(process.env.mongodb)
.then(console.log("Connected database successfully"))
.catch(err => console.log(err.msg))

app.use("/api/outapi/", userRouter)

let port = process.env.PORT
app.listen(port, () => console.log("http://localhost:"+port))

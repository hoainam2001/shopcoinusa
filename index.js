require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const userRouter = require('./routes/user')
const bodyParser = require('body-parser')

const app = express()


app.set('view engine', 'ejs')
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

switch(process.env.NODE_ENV){
    case 'product':
        // for product
        mongoose.connect(process.env.mongo_product)
        break
    case 'development':
        mongoose.connect(process.env.mongo_development)
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use("/api/outapi/", userRouter)

let port = process.env.PORT || 3000
app.listen(port, () => console.log("http://localhost:"+port))

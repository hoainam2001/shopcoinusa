const mongoose = require('mongoose')

const User = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    token: String,
    status: String,
    createAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now},
})

const Users = mongoose.model('Users', User)
module.exports = Users
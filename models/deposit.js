const mongoose = require('mongoose')

const Deposit = new mongoose.Schema({
    code: {type: String, default: "null"},
    status: {type: String, default: "Fake"},
    createAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now},
})

const Deposits = mongoose.model('Deposits', Deposit)
module.exports = Deposits
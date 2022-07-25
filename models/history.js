const mongoose = require('mongoose')

const History = new mongoose.Schema({
    code: {type: String, default: "null"},
    status: {type: String, default: "Fake"},
    createAt: {type: String, default: Date.now},
    updateAt: {type: String, default: Date.now},
})

const Historys = mongoose.model('histories', History)
module.exports = Historys
const mongoose = require('mongoose')

const Schema = mongoose.Schema

let todoSchema = new Schema({
    user: String,
    items: [String]
})

module.exports = mongoose.model('Todo', todoSchema)
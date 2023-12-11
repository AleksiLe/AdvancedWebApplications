const mongoose = require('mongoose')

mongoose.Promise = Promise

mongoose.connect('mongodb://127.0.0.1:27017/testdb')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err))

module.exports = mongoose



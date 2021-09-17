const mongoose = require('mongoose')

const Tournament = mongoose.Schema({
    id : String,
    poster : String,
    description : String
})

module.exports = mongoose.model("tournament", Tournament)
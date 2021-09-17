const mongoose = require('mongoose')

const settings = mongoose.Schema({
    prefix : String,
    gid : String,
    lang : String
})

module.exports = mongoose.model("Settings", settings)
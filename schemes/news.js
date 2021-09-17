const mongoose = require('mongoose');

const News = mongoose.Schema({
    id : String,
    title : String,
    date: String,
    body : String,
    images : String,
    video : String,
    language : String
})

module.exports = mongoose.model('News', News)
const mongoose = require('mongoose');
const reqString = {type:String, required: true};
const reqBoolean = {type:Boolean, required: true};
const reqNumber = {type:Number, required: true};

const Shop = mongoose.Schema({
    Date : reqString,
    uid : reqString,
    content : Array
})

module.exports = mongoose.model('Shop', Shop)
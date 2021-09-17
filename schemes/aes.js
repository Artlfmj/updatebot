const mongoose = require('mongoose');
const reqString = {type:String, required: true};
const reqBoolean = {type:Boolean, required: true};
const reqNumber = {type:Number, required: true};

const aesSchema = mongoose.Schema({
    build : reqString,
    key : reqString,
    updated : reqString,
    type : reqString
});

module.exports = mongoose.model('Aes', aesSchema);
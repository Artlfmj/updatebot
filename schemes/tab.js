const mongoose = require('mongoose');
const reqString = {type:String, required: true};
const reqBoolean = {type:Boolean, required: true};
const reqNumber = {type:Number, required: true};

const tabSchema = mongoose.Schema({
    sectionId : reqString,
    displayName : reqString,
    language : String
});

module.exports = mongoose.model('Tab', tabSchema);
let mongoose = require('mongoose');
let reqString = {type:String, required: true};
let reqBoolean = {type:Boolean, required: true};
let reqNumber = {type:Number, required: true};

let upcomingSchema = mongoose.Schema({
    build : reqString,
    items : Array
});

module.exports = mongoose.model('Update', upcomingSchema);
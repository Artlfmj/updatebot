const mongoose = require('mongoose');
const reqString = {type:String, required: true};
const reqBoolean = {type:Boolean, required: true};
const reqNumber = {type:Number, required: true};

const upcomingSchema = mongoose.Schema({
    id : reqString,
    name : reqString,
    
});

module.exports = mongoose.model('Upcoming', upcomingSchema);
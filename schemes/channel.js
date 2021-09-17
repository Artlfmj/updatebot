const mongoose = require('mongoose')
const Channel = mongoose.Schema({
    function : String,
    guildid : String,
    channelid : String
})

module.exports = mongoose.model("Channel", Channel)
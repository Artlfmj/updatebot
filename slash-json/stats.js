module.exports = {
    name : "stats",
    description : "Shows your stats",
    options : [
        {
            name : "username",
            type : "STRING",
            required : true,
            description : "The username of the account you want to get the stats of",
        },
        {
            name : "platform",
            type : "STRING",
            description : "The platform of the account you want to get the stats of",
            required : false,
            choices : [
                {
                    name : "EPIC",
                    value : "epic"
                },
                {
                    name : "PSN",
                    value : "psn"
                },
                
            ]
        }
    ]
}
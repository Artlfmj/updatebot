const stats = {
        name : "stats",
        description : "Gets stats of a Fortnite Player",
        options : [
            {
                name : "username",
                description : "Username of the account you wish to look at",
                required : true,
                type : "STRING"
            },
            {
                name : "platform",
                description : "Platform the user plays on",
                required : false,
                type : "STRING",
                choices : [
                    {
                        name : "pc",
                        value : "epic"
                    },
                    {
                        name : "Playstation",
                        value : "psn"
                    },
                    {
                        name : "xbox",
                        value : "xbl"
                    }
                ]
            },
            {
                name : "timewindow",
                description : "Timewindow of the stats to show",
                required : false,
                type : "STRING",
                choices : [
                    {
                        name : "lifetime",
                        value : "lifetime"
                    },
                    {
                        name : "season", 
                        value : "season"
                    }
                ]
            }
        ]
    };
    module.exports = stats

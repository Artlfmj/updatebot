const { get } = require('axios')
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const fs = require("fs");
const config = require("../botconfig/config.json")
const clock = require('date-events')()
const ee = require("../botconfig/embed.json");
const Channels = require('../schemes/channel')

module.exports = async (client) => {
    clock.on('minute', async() =>{
        const req = await get("https://fortniteapi.io/v2/items/upcoming", {
            params: {
                lang : "fr"
            },
            headers: {
                Authorization: config.fnapiio
            }
        })
        .catch(err => {
            return console.error(err)
        })
        
        const Upcoming = require('../schemes/upcoming')
        Upcoming
        .find()
        .select(`id name`)
        .exec()
        .then(docs => {
            
            const registered = []
            docs.forEach(doc =>{
                registered.push(doc.id)
            })
            req.data.items.forEach(async(item) => {
                
                if(!registered.includes(item.id)){
                    const newitem = new Upcoming({
                        id : item.id, 
                        name : item.name
                    })
                    newitem.save()
                    const servers = await Channels.find({function : "upcoming"})
                
                if(!servers) return
                servers.forEach(server => {
                    if(client.guilds.cache.has(server.guildid)){
                        const guild = client.guilds.cache.get(server.guildid)
                        
                        if(guild.channels.cache.has(server.channelid)){
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Nouvel Item Detecté!`)
                            .setImage(item.images.full_background)
                            .setColor(ee.color)
                            .addField("ID", item.id)
                            .addField("Nom", item.name)
                            .addField("Type", item.type.name)
                            
                            .setTimestamp(item.added.date)
                            if(item.builtInEmote){
                                embed.setThumbnail(item.builtInEmote.images.icon)
                            }
                            
                            if(item.video != null){
                                client.channels.cache.get(server.channelid).send({content : item.video})
                                .then(m => {
                                    if(m.crosspostable){
                                        m.crosspost()
                                    }
                                })
                            }
                            client.channels.cache.get(server.channelid).send({embeds : [embed]})
                            .then(m => {
                                if(m.crosspostable){
                                    m.crosspost()
                                }
                            })
                        } else {
                            console.log(`Un salon pour le post des nouveaux items est inexistant : ${server.guildid}\nSuppression en cours...`);
                            server.delete();
                        }
                    } else {
                        console.log(`Un serveur pour le post des nouveaux items est inexistant : ${server.guildid}\nSuppression en cours...`);
                        server.delete();
                    }
                    
                   
                })
                    
                }
            })
        })
        
    })
}
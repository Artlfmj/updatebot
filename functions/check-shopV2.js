const mongoose = require('mongoose')
const { get } = require('axios')
const clock = require('date-events')()
const config = require("../botconfig/config.json")
const Shop = require('../schemes/shop')
const ee = require("../botconfig/embed.json")
const Channels = require('../schemes/channel')
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!

module.exports = async (client) => {
    clock.on('minute', async() =>{
        let shop = await get("http://epsilon.projectheberg.fr:20229/api/v1/shop", {
            params : {
                lang : "fr",
                json : true
            },
        })
        .catch(err =>{
            return console.error(err.toJSON())
        })
        if(shop){
            shop = shop.data
            const check = await Shop.findOne({uid : shop.uid})
            if(!check){
                const embed = new Discord.MessageEmbed()
                .setTitle("New Shop!")
                .setImage(shop.image)
                .setColor(ee.color)
                const ch = await Channels.find({function : "shop"})
                let returning;
                if(shop.returning){
                    returning = new Discord.MessageEmbed()
                    .setTitle(`${shop.returning.objects.length} objet(s) sont revenus!`)
                    .setImage(shop.returning.link)
                    .setColor('RANDOM')
                    let description = ""
                    shop.returning.objects.forEach(item => {
                        description = description + "\n" + item.item.displayName + ` | ${item.difference.toString()} jours`
                    })
                    returning.setDescription(description)
                }
                ch.forEach(server => {
                    if(client.guilds.cache.has(server.guildid)){
                        const guild = client.guilds.cache.get(server.guildid)
                        
                        if(guild.channels.cache.has(server.channelid)){
                            let embeds = []
                            embeds.push(embed)
                            if(returning){embeds.push(returning)}
                            client.channels.cache.get(server.channelid).send({embeds : embeds})
                            .then(m => {
                                if(m.crosspostable){
                                    m.crosspost()
                                }
                            })
                        } else {
                            console.log(`Un salon pour le post du shop est inexistant : ${server.guildid}\nSuppression en cours...`);
                            server.delete();
                        }
                    } else {
                        console.log(`Un serveur pour le post du shop est inexistant : ${server.guildid}\nSuppression en cours...`);
                        server.delete();
                    }
                })

            }
            const ndb = new Shop({
                Date : new Date(),
                uid : shop.uid,
                content : shop.shop 
            })
            ndb.save()
        }
        

    })
}

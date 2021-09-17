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
        const shop = await get("https://fortniteapi.io/v2/shop", {
            params : {
                lang : "fr"
            },
            headers : {
                Authorization : config.fnapiio
            }
        })
        .catch(err =>{
            return console.error(err)
        })
        
       
        if(shop.data.fullShop){
            
            const db = await Shop.find().exec()
            .catch(e => {
                console.error(e)
            })
            
            const uids = []
            db.forEach(el =>{
                uids.push(el.uid)
            })
           
            if(!uids.includes(shop.data.lastUpdate.uid)){
                console.log(2)
                const { generateShop, getShopItems } = require("../shop");
                const items = await getShopItems(config.fnapiio, "fr");
                await generateShop(items, "CODE LFMRD #AD");
                
                const servers = await Channels.find({function : "shop"})
                
                if(!servers) return
                servers.forEach(server => {
                    console.log(3)
                    if(client.guilds.cache.has(server.guildid)){
                        const guild = client.guilds.cache.get(server.guildid)
                        
                        if(guild.channels.cache.has(server.channelid)){
                            
                            const attach = new Discord.MessageAttachment()
                            .setFile('./shop-cataba.png')
                            .setName('shop.jpg')
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Nouveau Shop detecté`)
                            .setColor(ee.color)
                            .addField(`Date`, shop.data.lastUpdate.date)
                            .addField("UID", shop.data.lastUpdate.uid)
                           
                        
                            client.channels.cache.get(server.channelid).send({embeds : [embed], files : [attach]})
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
            
                const ndb = new Shop({
                    Date : shop.data.lastUpdate.date,
                    uid : shop.data.lastUpdate.uid,
                    content : shop.data.shop 
                })
                ndb.save()
            }
        }
        
    })
}

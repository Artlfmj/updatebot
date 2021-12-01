const { get } = require('axios')
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const fs = require("fs");
const config = require("../botconfig/config.json")
const clock = require('date-events')()
const ee = require("../botconfig/embed.json");
const mongoose = require("mongoose");
const aes = require('../schemes/aes');
const Channels = require('../schemes/channel');
const guild_settings = require('../schemes/guild_settings');

module.exports = async (client) => {
    
    clock.on('second', async() =>{
        await get("https://fortnite-api.com/v2/aes", {
            params : {
                lang : "fr"
            }
        })
        .catch(err => {
            return console.error(err)
        })
        .then(async(req) => {
            
        
        const keys = []
        const files = []
        const aes = require('../schemes/aes')
        const docs = await aes.find().select("build key updated type")
        
        
            
            docs.forEach(key => {
                keys.push(key.key)
                
            })
            
           
            if(!keys.includes(req.data.data.mainKey)){
                const servers = await Channels.find({function : "aes"})
                
                if(!servers) return
                servers.forEach(async(server) => {
                    if(client.guilds.cache.has(server.guildid)){
                        const guild = await client.guilds.cache.get(server.guildid)
                        
                        if(guild.channels.cache.has(server.channelid)){
                            let lg = await guild_settings.findOne({gid : server.guildid})
                            if(!lg){
                                lg.lang = "en"
                            }
                            console.log(lg)
                            
                            const lgtext = require(`../translations/${lg.lang}.json`)
                            const embed = new Discord.MessageEmbed()
                            .setColor(ee.color)
                            .setTitle(`${req.data.data.build} \n${lgtext["001"]}`)
                            .setDescription(`${lgtext["002"]} ${req.data.data.mainKey}`)
                            .setTimestamp(req.data.data.updated)
                            client.channels.cache.get(server.channelid).send({embeds : [embed]})
                            .then(m => {
                                if(m.crosspostable){
                                    m.crosspost()
                                }
                            })
                        } else {
                            console.log(`Un salon pour le post d'aes est inexistant : ${server.guildid}\nSuppression en cours...`);
                            server.delete();
                        }
                    } else {
                        console.log(`Un serveur pour le post d'aes est inexistant : ${server.guildid}\nSuppression en cours...`);
                        server.delete();
                    }
                    
                   
                })
                const newkey = new aes({
                    build : req.data.data.build,
                    key : req.data.data.mainKey,
                    type : "mainKey",
                    updated : req.data.data.updated
                })
                newkey.save()
            }
            req.data.data.dynamicKeys.forEach(async(key) => {
                if(!keys.includes(key.key)){
                    const servers = await Channels.find({function : "aes"})
                    
                    if(!servers) return
                    servers.forEach(async(server) => {
                        if(client.guilds.cache.has(server.guildid)){
                            const guild = client.guilds.cache.get(server.guildid)
                            
                            if(guild.channels.cache.has(server.channelid)){
                                let lg = await guild_settings.findOne({gid : server.guildid})
                                if(!lg){
                                    lg = {
                                        gid : server.guildid,
                                        prefix : "!",
                                        lang : "en"
                                    }
                                }
                                console.log(lg)
                                const lgtext = require(`../translations/${lg.lang}.json`)
                                const embed = new Discord.MessageEmbed()
                                .setColor(ee.color)
                                .setTitle(`${req.data.data.build}\n${lgtext["003"]}`)
                                .setDescription(`${lgtext["004"]} ${key.pakFilename}: ${key.key}`)
                                .setTimestamp(req.data.data.updated)
                                
                                const channel = await client.channels.cache.get(server.channelid)
                                const botPermissionsFor = channel.permissionsFor(client.user);
                                console.log(botPermissionsFor)
                                if(botPermissionsFor){

                                }
                                channel.send({embeds : [embed]})
                                .catch(e => {
                                    return console.error(e)
                                })
                                .then(m => {
                                    if(m){
                                        if(m.crosspostable){
                                            m.crosspost()
                                        }
                                    }
                                    
                                })
                                
                            } else {
                                console.log(`Un salon pour le post d'aes est inexistant : ${server.guildid}\nSuppression en cours...`);
                                server.delete();
                            }
                        } else {
                            console.log(`Un serveur pour le post d'aes est inexistant : ${server.guildid}\nSuppression en cours...`);
                            server.delete();
                        }
                        
                        const newkey = new aes({
                            build : req.data.data.build,
                            key : key.key,
                            type : "dynamicKey",
                            updated : req.data.data.updated
                        })
                        newkey.save()
                    })
                }})
        
        })
                
    })
}
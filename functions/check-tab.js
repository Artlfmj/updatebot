const { get } = require('axios')
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const fs = require("fs");
const config = require("../botconfig/config.json")
const clock = require('date-events')()
const ee = require("../botconfig/embed.json");
const canvas = require("canvas")
const Channels = require('../schemes/channel');
const tab = require('../schemes/tab');
const guild_settings = require('../schemes/guild_settings')

module.exports = async (client) => {
    clock.on('minute', async() =>{
        const languages = require('../traductions/languages.json')
        for(const language of languages){
            await get("https://fortniteapi.io/v2/shop/sections/list", {
                params : {
                    lang : language
                },
                headers : {
                    Authorization : config.fnapiio
                }
            })
            .catch(err => {
                return console.error(`Il semblerait qu'un probleme ait eu lieu sur la requete pour les categories disponibles dans l'api.\n\nErreur: ${err}`.red)
            })
            .then(async(res) => {
                const Tab = require(`../schemes/tab`)
                const tabids = []
                const restabs = []
                res.data.sections.forEach(async(tab) => {
                    if(tab.listed){
                        restabs.push(tab.sectionId)
                    }
                })
                const tabmongo = await Tab.find({language : language})
                tabmongo.forEach(tab => {
                    tabids.push(tab.sectionId)
                })
                res.data.sections.forEach(async(tab) => {
                    if(!tab.listed) return
                    if(tabids.includes(tab.sectionId)) return
                    const newtab = new Tab({
                        sectionId : tab.sectionId,
                        displayName : tab.displayName,
                        language : language
                    })
                    const servers = await Channels.find({function : "tabs"})
                        
                    if(!servers) return
                    servers.forEach(async(server) => {
                    
                        if(client.guilds.cache.has(server.guildid)){
                            const guild = client.guilds.cache.get(server.guildid)
                            
                            if(guild.channels.cache.has(server.channelid)){
                                let lg = await guild_settings.findOne({gid : server.guildid})
                                if(!lg){
                                    lg.lang = "en"
                                }
                                
                                const lgtext = require(`../traductions/${lg.lang}.json`)
                                const embed = new Discord.MessageEmbed()
                                .setTitle(lgtext["005"])
                                .setColor(ee.color)
                                .addField(lgtext["006"], tab.sectionId)
                                .addField(lgtext["007"], tab.displayName)
                                .setTimestamp(tab.added)
                                
                            
                                client.channels.cache.get(server.channelid).send({embeds : [embed]})
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
                    newtab.save()
                })
                tabmongo.forEach(async(tab) => {
                    if(restabs.includes(tab.sectionId)) return
                    const servers = await Channels.find({function : "tabs"})
                        
                    if(!servers) return
                    servers.forEach(async(server) => {
                    
                        if(client.guilds.cache.has(server.guildid)){
                            const guild = client.guilds.cache.get(server.guildid)
                            
                            if(guild.channels.cache.has(server.channelid)){
                                let lg = await guild_settings.findOne({gid : server.guildid})
                                if(!lg){
                                    const nlg = new guild_settings({
                                        gid : server.guildid,
                                        prefix : "!",
                                        lang : "en"
                                    })
                                    await nlg.save()
                                    lg = await guild_settings.findOne({gid : server.guildid})
                                }
                                
                                const lgtext = require(`../traductions/${lg.lang}.json`)
                                const embed = new Discord.MessageEmbed()
                                .setTitle(lgtext["008"])
                                .setColor(ee.wrongcolor)
                                .addField(lgtext["006"], tab.sectionId)
                                .addField(lgtext["007"], tab.displayName)
                                .setTimestamp(tab.added)
                                
                            
                                client.channels.cache.get(server.channelid).send({embeds : [embed]})
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
                    tab.delete()
                })
            })
                    
        }
        
    })
}
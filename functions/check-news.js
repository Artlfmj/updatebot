const { get } = require('axios')
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const fs = require("fs");
const config = require("../botconfig/config.json")
const clock = require('date-events')()
const ee = require("../botconfig/embed.json");
const mongoose = require("mongoose");
const Channels = require('../schemes/channel')
const languages = require('../traductions/languages.json')
const news = require('../schemes/news')
const Canvas = require('canvas')
const canvasTxt = require('canvas-txt').default
const GIFEncoder = require('gifencoder')
const guild_settings = require('../schemes/guild_settings')

module.exports = async (client) => {
    clock.on('minute', async() =>{
        for(const language of languages){
            const req = await get("https://fortniteapi.io/v1/news", {
                params : {
                    lang : language,
                    live : true
                },
                headers : {
                    Authorization : config.fnapiio
                }
            })
            const res = req.data
            var newnews = []
            
            const results = await Promise.all(
                req.data.news.map(async (n) => {
                    const connection = await news.findOne({id : n.id, language : language});
                    if(!connection){
                        newnews.push(n)
                    }
                })
              );
            
            if(newnews.length){
                console.log(`News event: ${language} generation starting`)

                    const encoder = new GIFEncoder(1280, 720)
                    encoder.createReadStream().pipe(fs.createWriteStream(`assets/news/br/${language}.gif`))
                    encoder.start()
                    encoder.setRepeat(0)
                    encoder.setDelay(5000)

                    const canvas = Canvas.createCanvas(1280, 720)
                    const c = canvas.getContext('2d')
                    await Canvas.registerFont('assets/fonts/font.otf', { family: 'burbank' })

                    const tabTitleWidth = canvas.width/res.news.length

                    for (const news of res.news) {
                        with (c) {
                            const image = await Canvas.loadImage(news.image)
                            drawImage(image, 0, 0, canvas.width, canvas.height)
                            
                            fillStyle = '#014cbc70'
                            fillRect(0, 0, canvas.width, 50)
                            fillStyle = '#fff5'
                            fillRect(tabTitleWidth*res.news.indexOf(news), 0, tabTitleWidth, 50)
                            for (const n of res.news) {
                                fillStyle = '#fff'
                                var fontSize = 30
                                do font = `${fontSize--}px burbank`
                                while (measureText(n.tabTitle.toUpperCase()).width > (tabTitleWidth / 1.1))
                                fillText(n.tabTitle.toUpperCase(), tabTitleWidth * res.news.indexOf(n) + tabTitleWidth / 2 - (measureText(n.tabTitle.toUpperCase()).width / 2), (50+measureText('I').actualBoundingBoxAscent) / 2)
                            }

                            with (canvasTxt) {
                                font = 'burbank'
                                fontSize = 30
                                align = 'left'
                                vAlign = 'top'
                                text = drawText(c, news.body, 0, 2000, 950, 500)
                                text = drawText(c, news.body, 30, canvas.height-text.height-40, 950, 500)
                            }

                            const gradient = createLinearGradient(0, canvas.height-text.height-250, 0, canvas.height)
                            gradient.addColorStop(0, '#0000')
                            gradient.addColorStop(1, '#014cbc')
                            fillStyle = gradient
                            fillRect(0, canvas.height-text.height-250, canvas.width, text.height+250)

                            fillStyle = '#fff'
                            font = '50px burbank'
                            fillText(news.title.toUpperCase(), 30, canvas.height-text.height-45)

                            fillStyle = '#34f1ff'
                            with (canvasTxt) {
                                font = 'burbank'
                                fontSize = 30
                                align = 'left'
                                vAlign = 'top'
                                text = drawText(c, news.body, 0, 2000, 950, 500)
                                text = drawText(c, news.body, 30, canvas.height-text.height-40, 950, 500)
                            }

                            await encoder.addFrame(c)
                        }
                    }

                    encoder.finish()
                    const servers = await Channels.find({function : "news"})
                
                    if(!servers) return
                    servers.forEach(async(server) => {
                        if(client.guilds.cache.has(server.guildid)){
                            const guild = client.guilds.cache.get(server.guildid)
                            
                            if(guild.channels.cache.has(server.channelid)){
                                let lg = await guild_settings.findOne({gid : server.guildid})
                                if(!lg){
                                    lg.text = "en"
                                }
                                
                                const lgtext = require(`../traductions/${lg.lang}.json`)
                                const attach = new Discord.MessageAttachment()
                                .setFile(`assets/news/br/${language}.gif`)
                                .setName('news.gif')
                                client.channels.cache.get(server.channelid).send({files : [attach]})
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

                    newnews.forEach(async(nws) => {
                        let p = new news({
                            id : nws.id,
                            title : nws.title,
                            date: new Date(),
                            body : nws.body,
                            images : nws.image,
                            video : nws.video || null,
                            language : "en"
                        })
                        p.save()
                    })
                    


            }
        }
    })

}
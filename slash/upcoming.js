const Discord = require('discord.js')
const channel = require('../schemes/channel')
const { get } = require('axios')
const ee = require('../botconfig/embed.json')
const Canvas = require('canvas')
const config = require('../botconfig/config.json')
module.exports = {
	/**
	 * Generates the shop image in a design similar to the in-game design.
	 */
	async slash(client, interaction) {
        var items, imageSize = 256, interval = 20, titleY = 130, subTitleY = titleY+50, margin = 50, nbInlineItems = 5
        const req = await get("https://fortniteapi.io/v2/items/upcoming?lang=fr", {
            headers : {
                Authorization : config.fnapiio
            }
        })
        interaction.defer()
        items = req.data.items
        await Canvas.registerFont("./assets/fonts/BurbankBigRegularBlack.otf", {
			family: "Burbank Big Regular",
			style: "Black",
		});

        const canvas = await Canvas.createCanvas(nbInlineItems*(imageSize + interval)+2*margin-interval, Math.ceil(items.length / nbInlineItems)*(imageSize + interval)+subTitleY+2*margin-interval)
        const ctx = canvas.getContext('2d')
    
        with (ctx) {
            const gradient = createLinearGradient(0, 0, 0, canvas.height)
            gradient.addColorStop(0, '#0093fb')
            gradient.addColorStop(1, '#014cbc')
            fillStyle = gradient
            fillRect(0, 0, canvas.width, canvas.height)
    
            font = '70px Burbank Big Rg Bk'
            fillStyle = '#75c4f1'
            fillText(client.user.username.toUpperCase(), canvas.width-measureText(client.user.username.toUpperCase()).width-margin, titleY)
    
            fillStyle = '#fff'
            fillText("ARTICLES A VENIR", margin, titleY)
    
            font = '50px Burbank Big Rg Bk'
            fillStyle = '#75c4f1'
            if (subTitleY != titleY) fillText("UNRELEASED ITEMS", margin, subTitleY)
    
            var x = margin, y = subTitleY+margin
            for (var i=1; i<=items.length; i++) {
                try {
                    const image = await Canvas.loadImage(items[i-1].images.full_background)
                    drawImage(image, x, y, imageSize, imageSize)
                } catch (e) {
                    console.log(items[i-1].images.full_background)
                }
                if (i%nbInlineItems == 0) {
                    x=margin
                    y+=imageSize+interval
                } else {
                    x+=imageSize+interval
                }
            }
        }

        interaction.editReply({files : [canvas.toBuffer()]})

    }
}
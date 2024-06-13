const { EmbedBuilder } = require('discord.js')
class messageSender {
    constructor(client){
        this.client = client
    }

    embed({ title, color=0x0099FF,footer }){
        const guild = this.client

        const IFooter = footer ?? { text: guild.user.displayName, iconURL: guild.user.avatarURL()}
        const IEmbed= new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setTimestamp()
        .setFooter(IFooter)
        return IEmbed
    }
    
    send(embed, id){
        const guild = this.client
        const getId = id ?? process.env.logChannel

        const channelSender = guild.channels.cache.get(getId)
        channelSender.send({ embeds: [embed] })
    }
    async info(child, type, firstOnce){
        try {
            let logs;
			if(firstOnce){
				logs = await child.fetchAuditLogs({limit:1,type: type})
            } else {
                logs = await child?.guild.fetchAuditLogs({limit:1,type: type})
			}
            const log = logs.entries.first()
            return log
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = {
    messageSender
}
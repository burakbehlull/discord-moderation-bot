const { EmbedBuilder, AuditLogEvent } = require('discord.js')
const config = require('../config.json')

class messageSender {
    constructor(client){
        this.client = client
        this.audit = AuditLogEvent
        this.config = config
        
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
    async getUser(userId, interaction, firstOnce){
        if(!userId) return
        const target = interaction ?? this.client
        let user;
        if(firstOnce=="FETCH"){
            user = await target.members.fetch(userId)
        } else if(firstOnce==true){
            user = await target.members.cache.get(userId)
        } else {
            user = await target.guild.members.cache.get(userId)
        }
        
        return user
    }
    async getChannel(channelId, interaction){
        if(!userId) return
        const target = interaction ?? this.client
        const channel = await target.guild.channels.cache.get(channelId)
        return channel
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
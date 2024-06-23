const { Client, GatewayIntentBits, Collection,
     ChannelType, PermissionsBitField, Permissions } = require('discord.js')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

const db = require('./config/db')
const Room = require('./models/Room')

var client = (global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans, 
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations, 
        GatewayIntentBits.GuildWebhooks, 
        GatewayIntentBits.GuildInvites, 
        GatewayIntentBits.GuildVoiceStates, 
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping, 
        GatewayIntentBits.DirectMessages, 
        GatewayIntentBits.DirectMessageReactions, 
        GatewayIntentBits.DirectMessageTyping, 
        GatewayIntentBits.MessageContent,
    ],
}))

client.commands = new Collection()

// Komutlar klasörü (commands file)
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file)
	const command = require(filePath)
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command)
	} else {
		console.log(`[HATA] ${filePath} içinde 'data' ve 'execute' yok.`)
	}
}
console.log(`${commandFiles.length} komut yüklendi.`)

// Durum klasörü (events file)
const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file)
	const event = require(filePath)
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, ActivityType))
	} else {
		client.on(event.name, (...args) => event.execute(...args, client))
	}
}

client.on('ready', () => {
    console.log('Bot hazır!')
})

client.on('voiceStateUpdate', async (oldState, newState) => {
    if (newState.channelId === "1254188045431869531") {
        const cloneRoom = await newState?.channel?.clone({
            name: newState.member.displayName,
            type: ChannelType.GuildVoice,
            parent: newState.channel.parent.id,
            permissionOverwrites: [
                {
                    id: newState.member.id,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.Connect,
                        PermissionsBitField.Flags.Speak,
                        PermissionsBitField.Flags.Stream,
                        PermissionsBitField.Flags.UseVAD,
                        PermissionsBitField.Flags.PrioritySpeaker,
                        PermissionsBitField.Flags.MuteMembers,
                        PermissionsBitField.Flags.DeafenMembers,
                        PermissionsBitField.Flags.MoveMembers,
                        PermissionsBitField.Flags.ManageChannels,
                        PermissionsBitField.Flags.ManageRoles
                    ]
                }
            ]
        })
        await Room.create({
            id: cloneRoom.id,
            name: newState.member.displayName,
            ownerId: newState.member.id,
        })
        const member = newState.member
        await member.voice.setChannel(cloneRoom.id)
        return;
    }
    const room = await Room.findOne({ownerId: oldState.member.id})
    if(oldState.channelId && !newState.channelId){
        if(oldState.channelId==room?.id){
            const c = await oldState.guild.channels.cache.get(room?.id)
            await Room.deleteOne({ownerId: oldState.member.id})
            await c.delete()
        }
        return;
    }
})

db()
client.login(process.env.TOKEN)
.then(()=>console.log('Token girişi başarılı'))
.catch((err)=>console.log("Hata: ", err))
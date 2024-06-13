const { Client, GatewayIntentBits } = require('discord.js')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

const db = require('./config/db')

var client = new Client({
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
})

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

db()
client.login(process.env.TOKEN)
.then(()=>console.log('Token girişi başarılı'))
.catch((err)=>console.log("Hata: ", err))
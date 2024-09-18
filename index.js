const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js')
const path = require('path')
const fs = require('fs')

const { Base } = require('./helpers/base')

require('dotenv').config()
require('./config/db').db()


var client = (global.client = new Client({
    intents: Object.keys(GatewayIntentBits).map((intent) => GatewayIntentBits[intent]),
}))

client.commands = new Collection()

const base = new Base(client, __dirname)


base.loadCommands(base.setFileName('commands'))



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


client.login(process.env.TOKEN)
.then(()=>console.log('Token girişi başarılı'))
.catch((err)=>console.log("Hata: ", err))
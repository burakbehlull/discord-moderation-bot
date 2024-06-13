const { Client, GatewayIntentBits } = require('discord.js')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

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
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[HATA] ${filePath} içinde 'data' ve 'execute' yok.`)
	}
}
console.log(`${commandFiles.length} komut yüklendi.`);


client.on('ready', () => {
    console.log('Bot hazır!')
})

client.login(process.env.TOKEN)
.then(()=>console.log('Token girişi başarılı'))
.catch((err)=>console.log("Hata: ", err))
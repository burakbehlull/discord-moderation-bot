const { Client, GatewayIntentBits, Collection } = require('discord.js')

const { Base } = require('./helpers/base')

require('dotenv').config()
require('./config/db').db()

var client = (global.client = new Client({
    intents: Object.keys(GatewayIntentBits).map((intent) => GatewayIntentBits[intent]),
}))

client.commands = new Collection()

const base = new Base(client, __dirname)

base.loadCommands(base.setFileName('commands'))
base.loadsEvents(base.setFileName('events'))

client.login(process.env.TOKEN)
.then(()=>console.log('Token girişi başarılı'))
.catch((err)=>console.log("Hata: ", err))
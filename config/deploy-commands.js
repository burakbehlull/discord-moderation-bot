const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config()

const dir = path.join(__dirname, "..", "commands")
const files = fs.readdirSync(dir, { withFileTypes: true })

const commandsList = []
files.filter((file)=> file.name.endsWith('.js')).map((file)=> {
	const commandPath = path.join(dir, file.name)
	const commandFile = require(commandPath)
	commandsList.push(commandFile)
})

files.filter((file)=> !file.name.endsWith('.js')).map(file => {

	const filesPath = path.join(dir, file.name)

	fs.readdirSync(filesPath).filter(file => file.endsWith('.js')).forEach(command => {
		const filePath = path.join(filesPath, command)
		const commandFile = require(filePath)
		commandsList.push(commandFile.data)
	})

})

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commandsList.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(process.env.BOT_ID),
			{ body: commandsList },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
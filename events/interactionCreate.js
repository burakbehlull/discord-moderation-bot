const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`${interaction.commandName} komut bulunamadı.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`${interaction.commandName} uygulanmıyor.`);
			console.error(error);
		}
	},
};
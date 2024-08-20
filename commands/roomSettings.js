const { SlashCommandBuilder } = require('discord.js')

const { RoomButtons } = require('../helpers/crumbs')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('roomsettings')
    .setDescription('Room Settings'),

    async execute(interaction){    
        await interaction.reply({content: 'Private Room Settings', components: RoomButtons()})
    }
}


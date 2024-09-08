const { SlashCommandBuilder } = require('discord.js');
const DeletedMessage = require('../models/DeletedMessage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snipe')
        .setDescription('Son silinen mesajı gösterir.'),
    async execute(interaction) {
        const channelId = interaction.channel.id;

        try {
            const lastDeletedMessage = await DeletedMessage.findOne({ channelId }).sort({ createdAt: -1 });

            if (!lastDeletedMessage) {
                await interaction.reply({
                    content: 'Bu kanalda henüz silinen bir mesaj yok!',
                    ephemeral: true
                })
                return;
            }

            await interaction.reply({
                content: 'Son silinen mesaj:\n' + `Yazan: \`${lastDeletedMessage.authorTag}\`\n` + `Mesaj: \`${lastDeletedMessage.messageContent}\``, 
                ephemeral: true
            })
        } catch (error) {
            console.log('Hata: ', error.message)
        }
    },
}

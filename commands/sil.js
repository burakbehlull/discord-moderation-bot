const { SlashCommandBuilder } = require('discord.js')
const { PermissionsManager } = require('../managers/index')

module.exports = {
    data: new SlashCommandBuilder()
    // Delete Messages Function
    .setName('sil')
    .setDescription('Mesajları siler')
    .addIntegerOption(option=> 
        option
        .setName('amount') // number of messages to be deleted
        .setDescription('Silenecek mesaj sayısı')
        .setRequired(true)

    ),
    async execute(interaction){
        const deleteCount = interaction.options.getInteger('amount')

        if (deleteCount < 1 || deleteCount > 100) return await interaction.reply('Lütfen 1 ile 100 arasında bir sayı belirtin.')
        
        try {
            await interaction.channel.bulkDelete(deleteCount, true)
            await interaction.reply(`${deleteCount} mesaj başarıyla silindi.`)
            setTimeout(() => interaction.deleteReply(), 3000)
        } catch (err) {
            console.log("Hata", err.message)
            return await interaction.reply('Mesajları silerken bir hata oluştu.')
        }

    }
}
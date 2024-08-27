const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { messageSender } = require('../helpers/messageSender')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Avatarı gösterir.')
    .addUserOption(option=> 
        option
        .setName('user')
        .setDescription('Avatarını görüntülemek istediğiniz kullanıcı')
        .setRequired(false)

    ),
    async execute(interaction){
        const sender = new messageSender(interaction)
        const user = interaction.options.getUser('user') ?? interaction.user;
        try {

            const embed = new EmbedBuilder(sender.embed({
                title: 'Avatar',
                footer: { text: user.displayName, iconURL: user.avatarURL()},
            })).setImage(user.avatarURL())

            return await interaction.reply({ embeds: [embed] })
        } catch (error) {
            console.log('Hata: ', error.message)
        }
    }
}
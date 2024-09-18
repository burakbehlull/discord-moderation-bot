const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { messageSender } = require('../../helpers/messageSender')
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
            })).setDescription(`**[PNG](${user.displayAvatarURL({ dynamic: true, size: 1024 }).replace("webp", "png")}) | [JPG](${user.displayAvatarURL({ dynamic: true, size: 1024 }).replace("webp", "jpg")}) | [WEBP](${user.displayAvatarURL({ dynamic: true, size: 1024 }).replace("webp", "webp")}) | [GIF](${user.displayAvatarURL({ dynamic: true, size: 1024 }).replace("webp", "gif")})**`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))

            return await interaction.reply({ embeds: [embed] })
        } catch (error) {
            console.log('Hata: ', error.message)
        }
    }
}
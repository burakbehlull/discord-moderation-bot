const { SlashCommandBuilder } = require('discord.js');
const { PermissionsManager } = require('../managers/index')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Kanalı yeniler')
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('Yenilemek istediğiniz kanal')
                .setRequired(false)
        ),
    async execute(interaction) {
        try {
            
            const PM = new PermissionsManager(interaction)

            const channel = interaction.options.getChannel('channel') || interaction.channel

            const channelPosition = channel.position
            const channelName = channel.name
            const channelTopic = channel.topic || ''
            const channelParentId = channel.parentId
            const user = interaction.user

            const IsRoles = await PM.isRoles()
            const IsOwner = await PM.isOwner()
            const IsAuthority = await PM.isAuthority(PM.flags.Administrator)
            if(PM.permissions.isRole && !IsRoles || PM.permissions.isOwners && !IsOwner || PM.permissions.isAuthority && !IsAuthority) return await interaction.reply("Yetersiz yetki!")
            
            if (!channel.isTextBased()) return interaction.reply({ content: 'Bu komutu yalnızca metin kanallarında kullanabilirsin.', ephemeral: true })
            
            await channel.delete().catch((error) => {
                return interaction.reply({ content: `Kanal silinirken bir hata oluştu: ${error.message}`, ephemeral: true })
            })

            const newChannel = await interaction.guild.channels.create({
                name: channelName,
                type: channel.type,
                topic: channelTopic,
                parent: channelParentId,
                position: channelPosition
            })

            await newChannel.send({content: "**Kanal yenilendi.**  " + `\`${user.displayName}\``})        
        } catch (err) {
            console.log("Hata: ",err.message)
        }
    },
};
const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js')
const { messageSender } = require('../../helpers/messageSender')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('boosterspecial')
        .setDescription('Boosterlara özel rol'),
    async execute(interaction) {
        try {

            const sender = new messageSender(interaction)
            const emoji = "<:kelepce:1000432684499218573>"
    
            const roleCreateBtn = new ButtonBuilder()
                .setCustomId('tocreate')
                .setLabel('Rol Oluştur')
                .setStyle(ButtonStyle.Success)
                .setEmoji(emoji)
        
            const roleEditBtn = new ButtonBuilder()
                .setCustomId('toedit')
                .setLabel('Rolü Düzenle')
                .setStyle(ButtonStyle.Success)
                .setEmoji(emoji)
        
            const roleAddUserBtn = new ButtonBuilder()
                .setCustomId('touseradd')
                .setLabel('Role Kullanıcı Ekle')
                .setStyle(ButtonStyle.Primary)
                .setEmoji(emoji)
            const roleShow = new ButtonBuilder()
                .setCustomId('toshowrole')
                .setLabel('Rolü Görüntüle')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(emoji)
    
            const roleDeleteBtn = new ButtonBuilder()
                .setCustomId('todelete')
                .setLabel('Rolü Sil')
                .setStyle(ButtonStyle.Danger)
                .setEmoji(emoji)
        
            const action = new ActionRowBuilder()
                .addComponents(roleCreateBtn, roleEditBtn, roleAddUserBtn, roleShow, roleDeleteBtn)
        
            const IEmbed = new EmbedBuilder(sender.embed({title: 'BOOSTERLARA ÖZEL ROL'}))
                .setDescription('ÖZEL ROL SEÇENEKLERİ')
            await interaction.reply({ embeds: [IEmbed], components: [action] })
        } catch (error) {
            console.log('Hata: ', error.message)
        }
    },
}


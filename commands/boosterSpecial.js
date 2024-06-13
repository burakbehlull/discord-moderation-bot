const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('boosterSpecial')
        .setDescription('Boosterlara özel rol'),

    async execute(interaction) {    
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
    
        const roleDeleteBtn = new ButtonBuilder()
            .setCustomId('todelete')
            .setLabel('Rolü Sil')
            .setStyle(ButtonStyle.Danger)
            .setEmoji(emoji)
    
        const action = new ActionRowBuilder()
            .addComponents(roleCreateBtn, roleEditBtn, roleAddUserBtn, roleDeleteBtn)


    },
}
    

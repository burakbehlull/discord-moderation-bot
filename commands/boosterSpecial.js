const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const { messageSender } = require('../helpers/messageSender')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('boosterSpecial')
        .setDescription('Boosterlara özel rol'),
    async execute(interaction) {
    
        const userId = await interaction.user.id;
        const sender = new messageSender(interaction)
        const emoji = ""
    
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
    
        const IEmbed = new EmbedBuilder(sender.embed({title: 'BOOSTERLARA ÖZEL ROL'}))
            .setDescription('ÖZEL ROL SEÇENEKLERİ')
        await interaction.reply({ embeds: [IEmbed], components: [action] })
    
        const filter = i => i.user.id === userId;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
    
        collector.on('collect', async interaction => {
                // kodlar
        })
    
        collector.on('end', async collected => {
            if (collected.size === 0) {
                await interaction.editReply({
                    content: '1 dakika içinde herhangi bir eylem alınmadığı için işlem iptal edildi.',
                    components: []
                })
            }
        })

    },
}
    

const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, 
    ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
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
            if (interaction.customId === 'tocreate') {
				const modal = new ModalBuilder()
					.setCustomId('addmodal')
					.setTitle('Rol Ekle')
		
				const rolname = new TextInputBuilder()
					.setCustomId('rolname')
					.setLabel("Rol adı")
					.setStyle(TextInputStyle.Short)
		
				const color = new TextInputBuilder()
					.setCustomId('color')
					.setLabel("Renk")
					.setStyle(TextInputStyle.Short)
				const emoji = new TextInputBuilder()
					.setCustomId('emojiId')
					.setLabel("Emoji ID")
					.setStyle(TextInputStyle.Short)
		
				const rolnameAction = new ActionRowBuilder().addComponents(rolname)
				const colorAction = new ActionRowBuilder().addComponents(color)
				const emojiAction = new ActionRowBuilder().addComponents(emoji)

				modal.addComponents(rolnameAction, colorAction, emojiAction)
	
				return await interaction.showModal(modal)
			}
            if (interaction.customId === 'toedit'){}
            if (interaction.customId === 'touseradd'){}
            if (interaction.customId === 'todelete'){}
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
    

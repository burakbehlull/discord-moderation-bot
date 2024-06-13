const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, 
    ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')

const User = require('../models/User')
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
			if (interaction.customId === 'toedit') {
				const user = await User.findOne({userID: interaction.user.id})
				const uRole = interaction.guild.roles.cache.get(user?.role)
				if(user?.limit){
					const editModal = new ModalBuilder()
					.setCustomId('editmodal')
					.setTitle('Rol Düzenle')
		
					const rolname = new TextInputBuilder()
						.setCustomId('rolname')
						.setLabel('Rol adı')
						.setValue(`${uRole.name}`)
						.setPlaceholder(`${uRole.name}`)
						.setStyle(TextInputStyle.Short)
			
					const color = new TextInputBuilder()
						.setCustomId('color')
						.setLabel("Renk")
						.setValue(`${uRole.color}`)
						.setPlaceholder(`${uRole.color}`)
						.setStyle(TextInputStyle.Short)
						
					const emoji = new TextInputBuilder()
						.setCustomId('emojiId')
						.setLabel("Emoji ID")
						.setValue(`${user.eId}`)
						.setPlaceholder(`${user.eId}`)
						.setStyle(TextInputStyle.Short)
			
					const rolnameAction = new ActionRowBuilder().addComponents(rolname)
					const colorAction = new ActionRowBuilder().addComponents(color)
					const emojiAction = new ActionRowBuilder().addComponents(emoji)
					editModal.addComponents(rolnameAction, colorAction, emojiAction)
			
					
					return await interaction.showModal(editModal)
				}
				return await interaction.reply('Üstünüze kayıtlı rol yok.')

			}
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

client.on("interactionCreate", async (interaction) => {
    if(interaction.isModalSubmit()){
        if (interaction.customId === "addmodal") {
            const rolName = interaction.fields.getTextInputValue('rolname')
            const color = interaction.fields.getTextInputValue('color')
            const emojiId = interaction.fields.getTextInputValue('emojiId')
            const hashtag = color.startsWith('#')
            if(!hashtag) return await interaction.reply('Renk ataması yaparken lütfen başına # koyup, renk kodunuz giriniz.')
            
            const user = await User.findOne({userID: interaction.user.id})
            
            if(user?.limit) return await interaction.reply('Rolünüz zaten var!')
            const role = await interaction.guild.roles.create({
                name: rolName,
                color: color,
                icon: `https://cdn.discordapp.com/emojis/${emojiId}.png?size=96&quality=lossless`
            })
            if(user){
                user.role = interaction.user.id
                user.limit = false
                user.eId = emojiId
                await user.save()
            } else {
                await User.create({
                    userID: interaction.user.id,
                    role: role.id,
                    limit: true,
                    eId: emojiId
                })
            }
            return await interaction.reply('Rol oluşturuldu.')
        }
        if (interaction.customId === "editmodal") {
            const rolName = interaction.fields.getTextInputValue('rolname')
            const color = interaction.fields.getTextInputValue('color')
            const emojiId = interaction.fields.getTextInputValue('emojiId')

            const user = await User.findOne({userID: interaction.user.id})
            const uRole = interaction.guild.roles.cache.get(user.role)
            const convertColor = color.startsWith('#') ? color : Number(color)
            
            await uRole.edit({
                name: rolName,
                color: convertColor,
                icon: `https://cdn.discordapp.com/emojis/${emojiId}.png?size=96&quality=lossless`
            })
            user.eId = emojiId
            await user.save()
            await interaction.reply('Rol düzenlendi.')
        }
        return;
    }
})
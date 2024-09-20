const { Events, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js')

const User = require('../models/User')
const { Modal } = require('../helpers/index')
const { messageSender } = require('../helpers/messageSender')

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		try {
			const sender = new messageSender(interaction)
			if(interaction.isButton()){
				if (interaction.customId === 'tocreate') {
					const modal = new Modal("addmodal", "Rol Ekle")
					modal.add("rolname", "Rol Adı")
					modal.add("color", "Renk", {
						required: false
					})
					modal.add("emojiId", "Emoji ID", {
						required: false
					})
					const action = modal.build()
					return await interaction.showModal(action)
				}
				if (interaction.customId === 'toedit') {
					const user = await User.findOne({userID: interaction.user.id})
					const uRole = await interaction.guild.roles.cache.get(user?.role)
					const Eid = await user?.eId || ""
					if(!user || !user?.limit){
						await interaction.reply('Rolünüz yok.')
					}
					if(user?.limit){
						const modal = new Modal("editmodal", "Rol Düzenle")
						modal.add("rolname", "Rol Adı", {
							value: `${uRole.name}`,
							placeholder: `${uRole.name}`,
							required: false
						})
						modal.add("color", "Renk",{ 
							value: `${uRole.color}`,
							placeholder: `${uRole.color}`,
							required: false
						})
						modal.add("emojiId", "Emoji ID", {
							value: `${Eid}`,
							placeholder: `${Eid}`,
							required: false
						})
						const action = modal.build()
						return await interaction.showModal(action)
					}
					return await interaction.reply('Üstünüze kayıtlı rol yok.')
		
				}
				if (interaction.customId === 'touseradd') {
					const user = await User.findOne({userID: interaction.user.id})
					if(user?.limit){

						const modal = new Modal("useraddModal", "Role Kişi Ekle")
						modal.add("chosenUserId", "Kullanıcı ID", {
							placeholder: "Ekleyeceğiniz kullanıcının id'sini giriniz."
						})
						const action = modal.build()
						return await interaction.showModal(action)
					}
					await interaction.reply('Rolünüz yok.')
				}
				
				if (interaction.customId === 'toshowrole') {
					const user = await User.findOne({userID: interaction.user.id})
					if(!user){
						return interaction.reply('Üstünüze kayıtlı rol yok.')
					}
	
					const uRole = interaction.guild.roles.cache.get(user?.role)
					if (!uRole) {
						return interaction.reply('Rol bulunamadı.')
					}
					
					const embed = new EmbedBuilder(sender.embed({
						title: 'Rol Bilgisi',
						footer: { text: interaction.user.displayName, iconURL: interaction.user.avatarURL()}
					}))
						.setDescription(`**Rol**: ${uRole}\n\n**Rol sahibi**: <@${user.userID}>\n**Role sahip üyeler**: ${user?.hasRole.map((user)=>{ return `<@${user}>` })}`)
		
					return await interaction.reply({ embeds: [embed] })
				}
	
				if (interaction.customId === 'todelete') {
					const user = await User.findOne({userID: interaction.user.id})
					if(!user){
						return interaction.reply('Üstünüze kayıtlı rol yok.')
					}
	
					const uRole = interaction.guild.roles.cache.get(user?.role)
					if (!uRole) {
						return interaction.reply('Rol bulunamadı.')
					}
	
					uRole.delete()
					user.limit = false
					await user.save()
					return await interaction.reply('Rol Silindi')
				}
			}
			if(interaction.isModalSubmit()){
				const member = await interaction.guild.members.fetch(interaction.user.id)
				const isBooster = member.roles.cache.some(role => role.tags && role.tags.premiumSubscriberRole)
				if(isBooster){
					if (interaction.customId === "addmodal") {
						console.log(1)
						const rolName = interaction.fields.getTextInputValue('rolname')
						const color = interaction.fields.getTextInputValue('color')
						const emojiId = interaction.fields.getTextInputValue('emojiId') || ""
						const hashtag = color.startsWith('#')
						if(!hashtag) return await interaction.reply('Renk ataması yaparken lütfen başına # koyup, renk kodunuz giriniz.')
							console.log(2)
						const isIcon = emojiId ? `https://cdn.discordapp.com/emojis/${emojiId}.png?size=96&quality=lossless` : ""
						const user = await User.findOne({userID: interaction.user.id})
						
						console.log(3)
						if(user?.limit) return await interaction.reply('Rolünüz zaten var!')
						const role = await interaction.guild.roles.create({
							name: rolName,
							color: color || undefined,
							icon: isIcon
						})
						if(user){
							user.role = role.id
							user.limit = true
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
						const isIcon = emojiId ? `https://cdn.discordapp.com/emojis/${emojiId}.png?size=96&quality=lossless` : undefined
		
						await uRole.edit({
							name: rolName,
							color: convertColor || undefined,
							icon: isIcon
						})
						user.eId = emojiId
						await user.save()
						return await interaction.reply('Rol düzenlendi.')
					}
					if(interaction.customId === "useraddModal") {
						const userId = interaction.fields.getTextInputValue('chosenUserId')
						const user = await User.findOne({userID: interaction.user.id})
						const uRole = interaction.guild.roles.cache.get(user.role)
						const member = await interaction.guild.members.fetch(userId)
			
						if(!member) return await interaction.reply('Kullanıcı bulunamadı')
						if(!uRole) return await interaction.reply('Rol bulunamadı')
						if(user?.hasRole.includes(userId)) return await interaction.reply('Kullanıcı zaten role sahip.')
						
						await member.roles.add(user.role)
						await user.hasRole.push(userId)
						await user.save()
						return await interaction.reply(`<@${userId}> başarıyla role eklendi.`)
					}
					return;
				} else return
			}
		} catch (error) {
			console.log("Hata: ", error.message)
		}
	},
};
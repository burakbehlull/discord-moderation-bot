const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, Events } = require('discord.js')

const Room = require('../models/Room')

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if(interaction.isModalSubmit()){
			if(interaction.customId === "namemodal"){            
				const room = await Room.findOne({ownerId: interaction.user.id})
				if(!room) await interaction.reply('Odanız yok!')
				const c = await interaction.guild.channels.fetch(room?.id)
				const roomname = interaction.fields.getTextInputValue('roomname')
				if(!roomname) return
				await c?.edit({ name: roomname })
				
				return await c?.send(`Oda adı: ${roomname} olarak ayarlandı!`)
			}
			if(interaction.customId === "limitmodal"){
				const room = await Room.findOne({ownerId: interaction.user.id})
				if(!room) await interaction.reply('Odanız yok!')
				const c = await interaction.guild.channels.fetch(room?.id)
				const roomlimit = interaction.fields.getTextInputValue('roomlimit')
				if(!roomlimit) return
				await c?.edit({ userLimit: roomlimit })
				return await c?.send(`Oda limiti: ${roomlimit} olarak ayarlandı!`)
			}
			if(interaction.customId === "adduserModal"){
				const room = await Room.findOne({ownerId: interaction.user.id})
				if(!room) await interaction.reply('Odanız yok!')
				const c = await interaction.guild.channels.fetch(room?.id)
				const roomuserid = interaction.fields.getTextInputValue('roomuserid')
				if(!roomuserid) return
				const user = await interaction.guild.members.fetch(roomuserid);
				await c.permissionOverwrites?.edit(user, {
					Connect: true
				})
				return await c?.send(`<@${roomuserid}> kullanıcıya, ${c?.name} adlı odaya girme izni verildi.`)
			
			}
			if(interaction.customId === "deleteuserModal"){
				const room = await Room.findOne({ownerId: interaction.user.id})
				if(!room) await interaction.reply('Odanız yok!')
				const c = await interaction.guild.channels.fetch(room?.id)
				const roomuserid = interaction.fields.getTextInputValue('roomuserid')
				if(!roomuserid) return
				const user = await interaction.guild.members.fetch(roomuserid);
				await c.permissionOverwrites?.edit(user, {
					Connect: false
				})
				return await c?.send(`<@${roomuserid}> kullanıcının, ${c?.name} adlı odaya girme izni alındı.`)
			}
			if(interaction.customId === "kickuserModal"){
				const room = await Room.findOne({ownerId: interaction.user.id})
				if(!room) await interaction.reply('Odanız yok!')
				const c = await interaction.guild.channels.fetch(room?.id)
				const kickuserid = interaction.fields.getTextInputValue('kickuserid')
				if(!kickuserid) return
				const user = await interaction.guild.members.fetch(kickuserid)
				if (user?.voice.channelId !== c?.id) return await c?.send('Belirtilen kullanıcı bu kanalda değil.')
				await user?.voice.setChannel(null);
				return await c?.send(`<@${kickuserid}> kullanıcı, ${c?.name} adlı odadan atıldı!`)
			}
		}
		if(interaction.isButton()){
			if(interaction.customId=="roomnamebtn"){
				const nameModal = new ModalBuilder()
				.setCustomId('namemodal')
				.setTitle('Oda Adı')
	
				const roomName = new TextInputBuilder()
					.setCustomId('roomname')
					.setLabel('Oda Adı')
					.setPlaceholder(`room name`)
					.setStyle(TextInputStyle.Short)
				const nameAction = new ActionRowBuilder().addComponents(roomName)
	
				nameModal.addComponents(nameAction)
		
				return await interaction.showModal(nameModal)
			}
			if(interaction.customId=="roomlimitbtn"){
				const limitModal = new ModalBuilder()
					.setCustomId('limitmodal')
					.setTitle('Oda Limiti')
		
				const roomLimit = new TextInputBuilder()
					.setCustomId('roomlimit')
					.setLabel('Oda Adı')
					// .setValue(`${uRole.name}`)
					.setPlaceholder(`room limit`)
					.setStyle(TextInputStyle.Short)
				const limitAction = new ActionRowBuilder().addComponents(roomLimit)
	
				limitModal.addComponents(limitAction)
		
				return await interaction.showModal(limitModal)
			}
			if(interaction.customId=="roomlockbtn"){
				const room = await Room.findOne({ownerId: interaction.user.id})
				if(!room) await interaction.reply('Odanız yok!')
				const c = await interaction.guild.channels.fetch(room?.id)
				await c.permissionOverwrites?.edit(interaction.guild.roles.everyone, {
					Speak: false,
					Connect: false,
					ManageChannels: false,
					ManageRoles: false,
				})
				return await c?.send(`${c?.name} adlı oda kitlendi!`)
			}
			if(interaction.customId=="adduserbtn"){
				const addUserModal = new ModalBuilder()
				.setCustomId('adduserModal')
				.setTitle('Kullanıcı Ekle')
	
				const roomUserId = new TextInputBuilder()
					.setCustomId('roomuserid')
					.setLabel('Kullanıcı Id')
					.setPlaceholder(`user id`)
					.setStyle(TextInputStyle.Short)
				const addUserAction = new ActionRowBuilder().addComponents(roomUserId)
				addUserModal.addComponents(addUserAction)
				return await interaction.showModal(addUserModal)
	
			}
			if(interaction.customId=="deleteuserbtn"){
				const deleteUserModal = new ModalBuilder()
				.setCustomId('deleteuserModal')
				.setTitle('Kullanıcı Sil')
	
				const roomUserId = new TextInputBuilder()
					.setCustomId('roomuserid')
					.setLabel('Kullanıcı Id')
					.setPlaceholder(`user id`)
					.setStyle(TextInputStyle.Short)
				const deleteUserAction = new ActionRowBuilder().addComponents(roomUserId)
				deleteUserModal.addComponents(deleteUserAction)
				return await interaction.showModal(deleteUserModal)
	
			}
			if(interaction.customId=="kickuserbtn"){
				const kickUserModal = new ModalBuilder()
				.setCustomId('kickuserModal')
				.setTitle('Atılacak Kullanıcı Id')
	
				const kickUserId = new TextInputBuilder()
					.setCustomId('kickuserid')
					.setLabel('Kullanıcı Id')
					.setPlaceholder(`user id`)
					.setStyle(TextInputStyle.Short)
				const kickUserAction = new ActionRowBuilder().addComponents(kickUserId)
				kickUserModal.addComponents(kickUserAction)
				return await interaction.showModal(kickUserModal)
	
			}
			if(interaction.customId=="roomdeletebtn"){
				const room = await Room.findOne({ownerId: interaction.user.id})
				if(!room) await interaction.reply('Odanız yok!')
				const c = await interaction.guild.channels.fetch(room?.id)
				await c?.delete()
				await Room?.deleteOne({ownerId: interaction.user.id})
				return await interaction.reply(`${c?.name} adlı oda silindi!`)
			}
		}
	},
};
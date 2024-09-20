const { Events } = require('discord.js')

const Room = require('../models/Room')
const { Modal } = require('../helpers/index')


module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		try {
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
					const modal = new Modal("namemodal", "Oda Adı")
					modal.add('roomname', 'Oda Adı', {
						placeholder: 'room name'
					})
					const action = modal.build()
			
					return await interaction.showModal(action)
				}
				if(interaction.customId=="roomlimitbtn"){
					const modal = new Modal("limitmodal", "Oda Adı")
					modal.add('roomlimit', 'Oda Limiti', {
						placeholder: 'room limit'
					})
					const action = modal.build()
			
					return await interaction.showModal(action)
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

					const modal = new Modal("adduserModal", "Kullanıcı Ekle")
					modal.add('roomuserid', 'Kullanıcı Id', {
						placeholder: 'user id'
					})
					const action = modal.build()

					return await interaction.showModal(action)
		
				}
				if(interaction.customId=="deleteuserbtn"){
					const modal = new Modal("deleteuserModal", "Kullanıcı Sil")
					modal.add('roomuserid', 'Kullanıcı Id', {
						placeholder: 'user id'
					})
					const action = modal.build()

					return await interaction.showModal(action)
				}
				if(interaction.customId=="kickuserbtn"){
					const modal = new Modal("kickuserModal", "Atılacak Kullanıcı Id")
					modal.add('kickuserid', 'Kullanıcı Id', {
						placeholder: 'user id'
					})
					const action = modal.build()

					return await interaction.showModal(action)
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
		} catch (error) {
			console.log("Hata", error.message)
		}
	},
};
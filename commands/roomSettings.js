const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, 
    ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle,
    ChannelType, PermissionsBitField } = require('discord.js')
const Room = require('../models/Room')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('roomsettings')
    .setDescription('Room Settings'),

    async execute(interaction){

        const nameBtn = new ButtonBuilder()
            .setCustomId('roomnamebtn')
            .setLabel('name')
            .setStyle(ButtonStyle.Secondary)
        const limitBtn = new ButtonBuilder()
            .setCustomId('roomlimitbtn')
            .setLabel('limit')
            .setStyle(ButtonStyle.Secondary)
        const lockBtn = new ButtonBuilder()
            .setCustomId('roomlockbtn')
            .setLabel('lock')
            .setStyle(ButtonStyle.Secondary)
        const addUserBtn = new ButtonBuilder()
            .setCustomId('adduserbtn')
            .setLabel('add user')
            .setStyle(ButtonStyle.Secondary)
        const deleteBtn = new ButtonBuilder()
            .setCustomId('roomdeletebtn')
            .setLabel('delete')
            .setStyle(ButtonStyle.Danger)
        
        const action =  new ActionRowBuilder()
            .addComponents(nameBtn, limitBtn, lockBtn,addUserBtn, deleteBtn)
        await interaction.reply({content: 'Room Settings', components: [action]})

        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
    
        collector.on('collect', async interaction => {
            if(interaction.customId=="roomnamebtn"){
                const nameModal = new ModalBuilder()
                .setCustomId('namemodal')
                .setTitle('Oda Adı')
    
                const roomName = new TextInputBuilder()
                    .setCustomId('roomname')
                    .setLabel('Oda Adı')
                    // .setValue(`${uRole.name}`)
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
                await c.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                    Speak: false,
                    Connect: false,
                    ManageChannels: false,
                    ManageRoles: false,
                })
                return await interaction.reply(`${c?.name} adlı oda kitlendi!`)
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
            if(interaction.customId=="roomdeletebtn"){
                const room = await Room.findOne({ownerId: interaction.user.id})
                if(!room) await interaction.reply('Odanız yok!')
                const c = await interaction.guild.channels.fetch(room?.id)
                await c?.delete()
                await Room?.deleteOne({ownerId: interaction.user.id})
                return await interaction.reply(`${c?.name} adlı oda silindi!`)

            }
            
        })
        collector.on('end', async collected => {
            if (collected.size === 0) {
                await interaction.editReply({
                    content: '1 dakika içinde herhangi bir eylem alınmadığı için işlem iptal edildi.',
                    components: []
                })
            }
        })
    }
}



client?.on("interactionCreate", async (interaction) => {
    if(interaction.isModalSubmit()){
        if(interaction.customId === "namemodal"){            
            const room = await Room.findOne({ownerId: interaction.user.id})
            if(!room) await interaction.reply('Odanız yok!')
            const c = await interaction.guild.channels.fetch(room?.id)
            const roomname = interaction.fields.getTextInputValue('roomname')
            if(!roomname) return
            await c?.edit({ name: roomname })
            return await interaction.reply(`Oda adı: ${roomname} olarak ayarlandı!`)
        }
        if(interaction.customId === "limitmodal"){
            const room = await Room.findOne({ownerId: interaction.user.id})
            if(!room) await interaction.reply('Odanız yok!')
            const c = await interaction.guild.channels.fetch(room?.id)
            const roomlimit = interaction.fields.getTextInputValue('roomlimit')
            if(!roomlimit) return
            await c?.edit({ userLimit: roomlimit })
            return await interaction.reply(`Oda limiti: ${roomlimit} olarak ayarlandı!`)
        }
        if(interaction.customId === "adduserModal"){
            const room = await Room.findOne({ownerId: interaction.user.id})
            if(!room) await interaction.reply('Odanız yok!')
            const c = await interaction.guild.channels.fetch(room?.id)
            const roomuserid = interaction.fields.getTextInputValue('roomuserid')
            if(!roomuserid) return
            const user = await interaction.guild.members.fetch(roomuserid);
            await c.permissionOverwrites.edit(user, {
                Connect: true
            })
            return await interaction.reply(`<@${roomuserid}> kullanıcıya, ${c?.name} adlı odaya girme izni verildi.`)
        }
    }
})

client?.on('voiceStateUpdate', async (oldState, newState) => {
    if (newState.channelId === "1254188045431869531") {
        const owner = await Room.findOne({ownerId: newState.member.id})
        if(owner) return await oldState.reply('Zaten bir odanız var!') 
        const cloneRoom = await newState?.channel?.clone({
            name: newState.member.displayName,
            type: ChannelType.GuildVoice,
            parent: newState.channel.parent.id,
            permissionOverwrites: [
                {
                    id: newState.member.id,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.Connect,
                        PermissionsBitField.Flags.Speak,
                        PermissionsBitField.Flags.Stream,
                        PermissionsBitField.Flags.UseVAD,
                        PermissionsBitField.Flags.PrioritySpeaker,
                        PermissionsBitField.Flags.MuteMembers,
                        PermissionsBitField.Flags.DeafenMembers,
                        PermissionsBitField.Flags.MoveMembers,
                        PermissionsBitField.Flags.ManageChannels,
                        PermissionsBitField.Flags.ManageRoles
                    ]
                }
            ]
        })
        await Room.create({
            id: cloneRoom.id,
            ownerId: newState.member.id,
        })
        const member = newState.member
        await member.voice.setChannel(cloneRoom.id)
        return;
    }
    const room = await Room.findOne({ownerId: oldState.member.id})
    if(oldState.channelId && !newState.channelId){
        if(oldState.channelId==room?.id){
            const c = await oldState.guild.channels.cache.get(room?.id)
            await Room.deleteOne({ownerId: oldState.member.id})
            await c?.delete()
            return;
        }
    }
})
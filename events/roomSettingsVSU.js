const { ChannelType, PermissionsBitField, Events } = require('discord.js')

const Room = require('../models/Room')
const { CreateRoomChannelId } = require('../config.json')
const { RoomButtons } = require('../helpers/crumbs')


module.exports = {
	name: Events.VoiceStateUpdate,
	async execute(oldState, newState) {
        if(!CreateRoomChannelId) return
        if (newState.channelId === CreateRoomChannelId) {
            const owner = await Room.findOne({ownerId: newState.member.id})
            if(owner) return
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
            const c = await oldState.guild.channels.cache.get(cloneRoom?.id)
            await c?.send({content: 'Private Room Settings', components: RoomButtons()})
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
	},
};
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')


function RoomButtons(){
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
        .setLabel('add')
        .setStyle(ButtonStyle.Primary)
    const deleteUserBtn = new ButtonBuilder()
        .setCustomId('deleteuserbtn')
        .setLabel('remove')
        .setStyle(ButtonStyle.Danger)
    const kickUserBtn = new ButtonBuilder()
        .setCustomId('kickuserbtn')
        .setLabel('kick')
        .setStyle(ButtonStyle.Danger)
    const deleteBtn = new ButtonBuilder()
        .setCustomId('roomdeletebtn')
        .setLabel('delete')
        .setStyle(ButtonStyle.Danger)

    const action =  new ActionRowBuilder()
        .addComponents(nameBtn, limitBtn, lockBtn,addUserBtn)
    const action2 = new ActionRowBuilder()
        .addComponents(deleteUserBtn, kickUserBtn, deleteBtn)
    return [action, action2]
}

module.exports = {
    RoomButtons
}
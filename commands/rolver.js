const { SlashCommandBuilder } = require('discord.js')
const { PermissionsManager } = require('../managers/index')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Etiketlediğiniz kullanıcıyı banlar')
    .addUserOption(option=> 
        option
        .setName('user')
        .setDescription('Banlanacak kullanıcı')
        .setRequired(true)

    )
    .addRoleOption(option=>
        option
        .setName('role')
        .setDescription('Seçilecek Rol')
        .setRequired(true)
    ),
    async execute(interaction){
        try {
            const PM = new PermissionsManager(interaction)

            const fetchUser = interaction.options.getUser('user')
            const role = interaction.options.getRole('role')
            const user =  await interaction.guild.members.fetch(fetchUser.id)
            
            if(!user || !fetchUser) return await interaction.reply('Kullanıcı bulunamadı!')
            if(!role) return await interaction.reply('Rol bulunamadı!')
    
            const isRole = await interaction.guild.roles.cache.get(role.id)
            if(!isRole) return await interaction.reply('Böyle bir rol yok!')
            
            const isUserHasRole = user.roles.cache.has(role.id)
            if(isUserHasRole) return await interaction.reply('Kullanıcı zaten bu role sahip!')
            
    
            const IsOwner = await PM.isOwner()
            const IsRoles = await PM.isRoles()
    
            if(!IsOwner || !IsRoles) return await interaction.reply("Yetersiz yetki!")
    
            
            await user.roles?.add(role)
            return await interaction.reply('Rol başarıyla eklendi.')
        } catch (error) {
            console.log('Hata: ', error.message)
        }
    }
}
const { SlashCommandBuilder } = require('discord.js')
const { PermissionsManager } = require('../../managers/index')

module.exports = {
    data: new SlashCommandBuilder()
    // Delete a role above a user
    .setName('rolal')
    .setDescription('Kullanıcının rolünü alır')
    .addUserOption(option=> 
        option
        .setName('user')
        .setDescription('Rolü alınacak kullanıcı')
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
            if(!isUserHasRole) return await interaction.reply('Kullanıcı zaten bu role sahip!')
            
    
           	// Yetki Kontrolü
            const IsRoles = await PM.isRoles();
			const IsOwner = await PM.isOwner();
			const IsAuthority = await PM.isAuthority(PM.flags.ManageRoles, PM.flags.Administrator);
			
			const checks = [];
			if (PM.permissions.isRole) checks.push(IsRoles);
			if (PM.permissions.isOwners) checks.push(IsOwner);
			if (PM.permissions.isAuthority) checks.push(IsAuthority);

			const hasAtLeastOnePermission = checks.includes(true);
			
			if (!hasAtLeastOnePermission) return await interaction.reply("Yetersiz yetki!");
    
		  
    
            await user.roles?.remove(role)
            return await interaction.reply(`<@${user.id}> adlı kullanıcıdan ${role} rolü başarıyla alındı!`)
        } catch (error) {
            console.log('Hata: ', error.message)
        }
    }
}

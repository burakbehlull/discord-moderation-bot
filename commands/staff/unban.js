const { SlashCommandBuilder } = require('discord.js')
const { PermissionsManager } = require('../../managers/index')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Etiketlediğiniz kullanıcının banını kaldırır')
    .addStringOption(option=> 
        option
        .setName('userid')
        .setDescription('Banı kalkacak kullanıcının ID')
        .setRequired(true)
    ),
    async execute(interaction){
        try {
			
            const PM = new PermissionsManager(interaction)

            const userId = interaction.options.getString('userid')
			const guild = interaction.guild
			
            if(!userId) return await interaction.reply("Kullanıcı Id'si belirtiniz.")
				
			// Yetki Kontrolü
			const IsRoles = await PM.isRoles();
			const IsOwner = await PM.isOwner();
			const IsAuthority = await PM.isAuthority(PM.flags.BanMembers, PM.flags.Administrator);

			
			const checks = [];
			if (PM.permissions.isRole) checks.push(IsRoles);
			if (PM.permissions.isOwners) checks.push(IsOwner);
			if (PM.permissions.isAuthority) checks.push(IsAuthority);

			const hasAtLeastOnePermission = checks.includes(true);
			
			if (!hasAtLeastOnePermission) return await interaction.reply("Yetersiz yetki!");
			
            await guild.bans.remove(userId).then(async()=> {
                await interaction.reply(` <@${userId}> adlı kullanıcının banı kaldırıldı.`);
                return;
            }).catch(async(err)=> {
                console.log(err)
                await interaction.reply('Kullanıcının banı açılırken hata oluştu!')
                return;
            })
			
        } catch (error) {
            console.log('Hata: ', error.message)
        }

    }
}
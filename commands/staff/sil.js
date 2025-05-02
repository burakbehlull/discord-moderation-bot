const { SlashCommandBuilder } = require('discord.js')
const { PermissionsManager } = require('../../managers/index')

module.exports = {
    data: new SlashCommandBuilder()
    // Delete Messages Function
    .setName('sil')
    .setDescription('Mesajları siler')
    .addIntegerOption(option=> 
        option
        .setName('amount')
        .setDescription('Silenecek mesaj sayısı')
        .setRequired(true)
    ),
    async execute(interaction){
        const deleteCount = interaction.options.getInteger('amount')
        const PM = new PermissionsManager(interaction)

        if (deleteCount < 1 || deleteCount > 100) return await interaction.reply('Lütfen 1 ile 100 arasında bir sayı belirtin.')

		// Yetki Kontrolü
        const IsRoles = await PM.isRoles();
		const IsOwner = await PM.isOwner();
		const IsAuthority = await PM.isAuthority(PM.flags.ManageMessages, PM.flags.Administrator);
			
		const checks = [];
		if (PM.permissions.isRole) checks.push(IsRoles);
		if (PM.permissions.isOwners) checks.push(IsOwner);
		if (PM.permissions.isAuthority) checks.push(IsAuthority);

		const hasAtLeastOnePermission = checks.includes(true);
			
		if (!hasAtLeastOnePermission) return await interaction.reply("Yetersiz yetki!");
	
        try {
            await interaction.channel.bulkDelete(deleteCount, true)
            await interaction.reply(`${deleteCount} mesaj başarıyla silindi.`)
            setTimeout(() => interaction.deleteReply(), 3000)
        } catch (err) {
            console.log("Hata", err.message)
            return await interaction.reply('Mesajları silerken bir hata oluştu.')
        }

    }
}
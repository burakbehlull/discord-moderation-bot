const { SlashCommandBuilder } = require('discord.js');
const { PermissionsManager } = require('../../managers/index');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Etiketlediğiniz kullanıcıyı (sunucuda olmasa bile) banlar.')
        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('Banlanacak kullanıcı')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Banlanma açıklaması')
                .setRequired(false)
        ),
        
    async execute(interaction) {
        try {
            const PM = new PermissionsManager(interaction);

            const fetchUser = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') ?? " ";
            const userId = fetchUser.id;

            // Yetki Kontrolü
            const IsRoles = await PM.isRoles();
            const IsOwner = await PM.isOwner();
            const IsAuthority = await PM.isAuthority(PM.flags.BanMembers, PM.flags.Administrator);

            const checks = [];
            if (PM.permissions.isRole) checks.push(IsRoles);
            if (PM.permissions.isOwners) checks.push(IsOwner);
            if (PM.permissions.isAuthority) checks.push(IsAuthority);

            const hasAtLeastOnePermission = checks.includes(true);

            if (!hasAtLeastOnePermission) {
                return await interaction.reply("Yetersiz yetki!");
            }
            const member = await interaction.guild.members.fetch(userId).catch(() => null);

            if (member) {

                await member.ban({ reason });
            } else {

                await interaction.guild.bans.create(userId, { reason });
            }

            await interaction.reply(`<@${userId}> adlı kullanıcı ${reason ? `**${reason}** sebebiyle` : ""} banlandı!`);

        } catch (error) {
            console.error('Hata:', error);
            await interaction.reply('Kullanıcı banlanırken bir hata oluştu!');
        }
    }
};

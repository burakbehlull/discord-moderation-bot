const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { PermissionsManager } = require('../../managers/index')
const { Button } = require('../../helpers/components')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Etiketlediğiniz kullanıcıyı kayıt eder')
    .addUserOption(option=> 
        option
        .setName('user')
        .setDescription('Kayıt edilecek kullanıcı')
        .setRequired(true)

    ),
    async execute(interaction){
        try {
            const btn = new Button()
            btn.add('men', 'men', btn.style.Primary)
            btn.add('woman', 'woman', btn.style.Danger)
            const w = btn.build()
            const PM = new PermissionsManager(interaction)

            const fetchUser = interaction.options.getUser('user')
            const user =  await interaction.guild.members.fetch(fetchUser.id)
            
            if(!user) return await interaction.reply('Kullanıcı bulunamadı!')
            
            const IsRoles = await PM.isRoles()
            const IsOwner = await PM.isOwner()
            const IsAuthority = await PM.isAuthority(PM.flags.BanMembers, PM.flags.Administrator)
            if(PM.permissions.isRole && !IsRoles || PM.permissions.isOwners && !IsOwner || PM.permissions.isAuthority && !IsAuthority) return await interaction.reply("Yetersiz yetki!")
            
            
            const embed = new EmbedBuilder()
                .setTitle('Register')
                .setColor(0x0099FF)
                .setDescription(`Kayıt için düğmeye basınız!`)
                .setTimestamp()
                .setFooter({ text: interaction.user.displayName, iconURL: interaction.user.avatarURL()})
            interaction.reply({embeds: [embed], components: [w] })
            // codes
        } catch (error) {
            console.log('Hata: ', error.message)
        }
    }
}
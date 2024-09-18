const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { PermissionsManager } = require('../../managers/index')
const { Button, messageSender } = require('../../helpers/index')
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
            

            const PM = new PermissionsManager(interaction)
            const sender = new messageSender(interaction)

            const fetchUser = interaction.options.getUser('user')
            const user =  await interaction.guild.members.fetch(fetchUser.id)
            
            if(!user) return await interaction.reply('Kullanıcı bulunamadı!')
            
            const IsRoles = await PM.isRoles()
            const IsOwner = await PM.isOwner()
            const IsAuthority = await PM.isAuthority(PM.flags.BanMembers, PM.flags.Administrator)
            if(PM.permissions.isRole && !IsRoles || PM.permissions.isOwners && !IsOwner || PM.permissions.isAuthority && !IsAuthority) return await interaction.reply("Yetersiz yetki!")
            
            const btn = new Button()
            btn.add('man', 'man', btn.style.Primary)
            btn.add('woman', 'woman', btn.style.Danger)
            const btns = btn.build()
            
            const embed = new EmbedBuilder(sender.embed({
                title: 'Register',
                footer: { text: interaction.user.displayName, iconURL: interaction.user.avatarURL()},
            }))
            .setDescription(`Kayıt için düğmeye basınız!`)

            await interaction.reply({embeds: [embed], components: [btns] })
            // codes
        } catch (error) {
            console.log('Hata: ', error.message)
        }
    }
}
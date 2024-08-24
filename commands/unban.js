const { SlashCommandBuilder } = require('discord.js')
const { PermissionsManager } = require('../managers/index')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Etiketlediğiniz kullanıcının banını kaldırır')
    .addStringOption(option=> 
        option
        .setName('userid')
        .setDescription('Banı kalkacak kullanıcı')
        .setRequired(true)
    )
    .addStringOption(option=>
        option
        .setName('reason')
        .setDescription('Kalkacak unban açıklaması')
        .setRequired(false)
    ),
    async execute(interaction){
        try {
            const PM = new PermissionsManager(interaction)

            const userId = interaction.options.getString('userid')
            const reason = interaction.options.getString('reason') ?? " "
    
            if(!userId) return await interaction.reply("Kullanıcı Id'si belirtiniz.")
    
            const user =  await interaction.guild.members.fetch(userId)
    
            const IsRoles = await PM.isRoles()
            const IsOwner = await PM.isOwner()
            const IsAuthority = await PM.isAuthority(PM.flags.BanMembers, PM.flags.Administrator)
            if(PM.permissions.isRole && !IsRoles || PM.permissions.isOwners && !IsOwner || PM.permissions.isAuthority && !IsAuthority) return await interaction.reply("Yetersiz yetki!")
            
    
            if(!user) return await interaction.reply('Kullanıcı bulunamadı!')
            
            await user.kick({
                reason
            }).then(async()=> {
                await interaction.reply('Kullanıcı kicklendi!')
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
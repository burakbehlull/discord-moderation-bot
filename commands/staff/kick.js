const { SlashCommandBuilder } = require('discord.js')
const { PermissionsManager } = require('../../managers/index')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Etiketlediğiniz kullanıcıyı kickler')
    .addUserOption(option=> 
        option
        .setName('user')
        .setDescription('Kicklenecek kullanıcı')
        .setRequired(true)
    )
    .addStringOption(option=>
        option
        .setName('reason')
        .setDescription('Kick açıklaması')
        .setRequired(false)
    ),
    async execute(interaction){
        try {
            const PM = new PermissionsManager(interaction)

            const fetchUser = interaction.options.getUser('user')
            const reason = interaction.options.getString('reason') ?? " "
            const user =  await interaction.guild.members.fetch(fetchUser.id)
            
            const IsRoles = await PM.isRoles()
            const IsOwner = await PM.isOwner()
            const IsAuthority = await PM.isAuthority(PM.flags.KickMembers, PM.flags.Administrator)
            if(PM.permissions.isRole && !IsRoles || PM.permissions.isOwners && !IsOwner || PM.permissions.isAuthority && !IsAuthority) return await interaction.reply("Yetersiz yetki!")
            
    
            if(!user) return await interaction.reply('Kullanıcı bulunamadı!')
            
            await user.kick({
                reason
            }).then(async()=> {
                await interaction.reply('Kullanıcı kicklendi!')
                return;
            })
            .catch(async(err)=> {
                console.log(err)        
                await interaction.reply('Kullanıcı kicklenirken hata oluştu!')
                return;
            })
    
            await interaction.reply('Kullanıcı kicklendi!')
        } catch (error) {
            console.log('Hata: ', error.message)
        }
    }
}
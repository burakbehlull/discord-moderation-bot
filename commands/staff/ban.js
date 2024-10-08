const { SlashCommandBuilder } = require('discord.js')
const { PermissionsManager } = require('../../managers/index')

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
    .addStringOption(option=>
        option
        .setName('reason')
        .setDescription('Banlanma açıklaması')
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
            const IsAuthority = await PM.isAuthority(PM.flags.BanMembers, PM.flags.Administrator)
            if(PM.permissions.isRole && !IsRoles || PM.permissions.isOwners && !IsOwner || PM.permissions.isAuthority && !IsAuthority) return await interaction.reply("Yetersiz yetki!")
            
    
    
            if(!user) return await interaction.reply('Kullanıcı bulunamadı!')
            
            await user.ban({
                reason
            }).then(async ()=> {
                await interaction.reply('Kullanıcı banlandı!')
                return;
            })
            .catch(async(err)=> {
                console.log(err)
                await interaction.reply('Kullanıcı banlanırken hata oluştu!')
                return;
            })
        } catch (error) {
            console.log('Hata: ', error.message)
        }
    }
}
const { SlashCommandBuilder } = require('discord.js')

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
        const fetchUser = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason') ?? " "
        const user =  await interaction.guild.members.fetch(fetchUser.id)

        if(!user) return await interaction.reply('Kullanıcı bulunamadı!')
        
        await user.kick({
            reason
        }).then(()=> {})
        .catch(err=> {
            console.log(err)
            return;
        })

        await interaction.reply('Kullanıcı kicklendi!')
    }
}
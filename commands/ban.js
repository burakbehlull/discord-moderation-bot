const { SlashCommandBuilder } = require('discord.js')

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
        const fetchUser = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason') ?? " "
        const user =  await interaction.guild.members.fetch(fetchUser.id)

        if(!user) return await interaction.reply('Kullanıcı bulunamadı!')
        
        await user.ban({
            reason
        }).then(()=> {})
        .catch(err=> {
            console.log(err)
            return;
        })

        await interaction.reply('Kullanıcı banlandı!')
    }
}
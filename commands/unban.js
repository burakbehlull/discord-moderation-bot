const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Etiketlediğiniz kullanıcının banını kaldırır')
    .addUserOption(option=> 
        option
        .setName('user')
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
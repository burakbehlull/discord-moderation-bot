const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Etiketlediğiniz kullanıcının banını kaldırır')
    .addStringOption(option=> 
        option
        .setName('userId')
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
        const userId = interaction.options.getString('userId')
        const reason = interaction.options.getString('reason') ?? " "

        if(!userId) return await interaction.reply("Kullanıcı Id'si belirtiniz.")

        const user =  await interaction.guild.members.fetch(userId)

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

    }
}
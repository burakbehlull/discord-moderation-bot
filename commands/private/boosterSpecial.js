const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { messageSender } = require('../../helpers/messageSender')
const { Button } = require('../../helpers/index')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('boosterspecial')
        .setDescription('Boosterlara özel rol'),
    async execute(interaction) {
        try {

            const sender = new messageSender(interaction)

            const btn = new Button()
            btn.add("tocreate", "Rol Oluştur", btn.style.Danger)
            btn.add("toedit", "Rolü Düzenle", btn.style.Success)
            btn.add("touseradd", "Role Kullanıcı Ekle", btn.style.Primary)
            btn.add("toshowrole", "Rolü Görüntüle", btn.style.Secondary)
            btn.add("todelete", "Rolü Sil", btn.style.Danger)
        
            const action = btn.build()

            const IEmbed = new EmbedBuilder(sender.embed({title: 'BOOSTERLARA ÖZEL ROL'}))
                .setDescription('ÖZEL ROL SEÇENEKLERİ')
            await interaction.reply({ embeds: [IEmbed], components: [action] })
        } catch (error) {
            console.log('Hata: ', error.message)
        }
    },
}


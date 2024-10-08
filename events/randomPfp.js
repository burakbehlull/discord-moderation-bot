const { Events, EmbedBuilder } = require('discord.js')
const { RandomPfpChannel, isRandomPfp } = require('../config.json')
module.exports = {
    name: Events.UserUpdate,
    async execute(oldUser, newUser, interaction) {
        try {
			if(!isRandomPfp) return
            function isGifAvatar(avatarUrl) {
                return avatarUrl.includes('.gif');
            }

            const user = await interaction.users.fetch(oldUser.id)
            const channel = await interaction.channels.cache.get(RandomPfpChannel)
            
            let avatar = user.displayAvatarURL({ dynamic: true, size: 1024 });
            if(oldUser===newUser) return
            if(isGifAvatar(avatar)){
                avatar.replace('webp', 'gif')
            } else {
                avatar.replace('webp', 'png')
            }

            const embed = new EmbedBuilder()
            .setTitle(`${user.globalName}`)
            .setImage(avatar)
            
            await channel.send({embeds: [embed]})
        } catch (error) {
            console.log('Hata: ', error.message)
        }
    }
}
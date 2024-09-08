const DeletedMessage = require('../models/DeletedMessage');

module.exports = {
    name: 'messageDelete',
    async execute(message, interaction) {
        try {
            if (message.author.bot) return

            const deletedMessage = new DeletedMessage({
                messageContent: message.content,
                authorTag: message.author.tag,
                channelId: message.channel.id,
                guildId: message.guild.id
            })

            await deletedMessage.save()
                .then(() => console.log('Silinen mesaj kaydedildi.'))
                .catch(err => console.error('Mesaj kaydedilirken hata oluştu:', err))
        } catch (error) {
            console.log('Hata: ', error.message)
        }
    }
};
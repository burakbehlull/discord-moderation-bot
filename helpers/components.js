const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")

class Button {
    constructor(){
        this.buttons = []
        this.style = ButtonStyle
    }
    add(customId, label, style, emoji, disabled){
        if(!customId || !label || !style) return
        
        const btn = new ButtonBuilder()
            .setCustomId(customId)
            .setLabel(label)
        if(emoji) btn.setEmoji(emoji)
        if(disabled) btn.setDisabled(disabled)
        if(style) btn.setStyle(style)
        this.buttons.push(btn)

    }
    build(){
        const rows = new ActionRowBuilder().addComponents(...this.buttons)
        return rows
    }
}

module.exports = {
    Button
}
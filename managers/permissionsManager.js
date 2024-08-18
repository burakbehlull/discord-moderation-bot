const { permissions } = require('../config.json')

class PermissionsManager {
    constructor(interaction){
        if(!interaction) {
            console.log('Interaction belirtilmemiş!')
            return
        }
        this.interaction = interaction
    }
    async isOwner(){
        const userId = interaction.user.id
        const { owners, isOwners } = permissions
        if(isOwners){
            return owners.includes(userId)
        }
    }
    async isRoles(){
        const userId = await this.interaction.user.id
        const member = this.interaction.guild.members.cache.get(userId)
        const { roles, isRole } = permissions
        if(isRole){
            return roles.forEach(async (role, i)=>{
                let hasRole = await member.roles.cache.has(role)
                if(hasRole){
                    return true
                }
            })
        }
    }
}

module.exports = PermissionsManager
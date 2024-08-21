const { permissions } = require('../config.json')

class PermissionsManager {
    constructor(interaction){
        if(!interaction) {
            console.log('Interaction belirtilmemiş!')
            return
        }
        this.interaction = interaction
        this.permissions = permissions
    }
    async isOwner(){
        const userId = this.interaction.user.id
        const { owners, isOwners } = permissions
        if(isOwners){
            console.log(owners.includes(userId))
            return owners.includes(userId)
        }
    }
    async isRoles(){
        const userId = await this.interaction.user.id
        const member = this.interaction.guild.members.cache.get(userId)
        const { roles, isRole } = permissions
		if (isRole) {
			let statusPromises = roles.map(async (role) => {
				let hasRole = await member.roles.cache.has(role)
				return hasRole
			})

			let status = await Promise.all(statusPromises)

			let hasRoleStatus = status.includes(true)

			return hasRoleStatus
		}

    }
}

module.exports = PermissionsManager
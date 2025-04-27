const { permissions } = require('../config.json')
const { PermissionsBitField } = require('discord.js')

class PermissionsManager {
    constructor(interaction){
        if(!interaction) {
            console.log('Interaction belirtilmemiş!')
            return
        }
        this.interaction = interaction
        this.permissions = permissions
        this.flags = PermissionsBitField.Flags
    }
    async isOwner(){
        const userId = this.interaction.user.id
        const { owners, isOwners } = permissions
        if (!isOwners) return false

		return owners.includes(userId)
    }
	async isRoles() {
		const userId = this.interaction.user.id
		const { roles, isRole } = permissions

		if (!isRole) return false

		let member = this.interaction.guild.members.cache.get(userId)
		if (!member) {
			member = await this.interaction.guild.members.fetch(userId).catch(() => null)
		}
		if (!member) return false

		const status = roles.map(role => member.roles.cache.has(role))
		return status.includes(true)
	}
    async isAuthority(...authorities){
        if (this.permissions.isAuthority && authorities.length) {
            const member = this.interaction.member
			return authorities.some(authority => member.permissions.has(authority))
        }
		return false
    }
    async selectOwnerIds(status,...userIds){
        const userId = this.interaction.user.id
        const ids = userIds
        if(status && userIds){
            return ids.includes(userId)
        }
    }
    async selectRolesIds(status, ...rolesIds){
        const userId = this.interaction.user.id
        const member = this.interaction.guild.members.cache.get(userId)
        const roles = rolesIds
        if(status && roles){
			let statusPromises = roles.map(async (role) => {
				let hasRole = await member.roles.cache.has(role)
				return hasRole
			})

			let statusAll = await Promise.all(statusPromises)

			let hasRoleStatus = statusAll.includes(true)

			return hasRoleStatus
        }
    }
}

module.exports = PermissionsManager

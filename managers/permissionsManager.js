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
    async isAuthority(...authorities){
        if(this.permissions.isAuthority && authorities){
            const member = this.interaction.member
            const result = authorities.map((authority)=> {
                const isHasAuthority =  member.permissions.has(authority)
                if(isHasAuthority){
                    return true
                }
                return false
            })

            return result.includes(true)

        }
    }
    async selectOwnerIds(status,...userIds){
        const userId = this.interaction.user.id
        const ids = userIds
        if(status && userIds){
            return ids.includes(userId)
        }
    }
    async selectRolesIds(status, ...rolesIds){
        const userId = await this.interaction.user.id
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
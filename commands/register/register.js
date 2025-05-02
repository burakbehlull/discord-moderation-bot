const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { PermissionsManager } = require('../../managers/index')
const { messageSender } = require('../../helpers/index')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Etiketlediğiniz kullanıcıyı kayıt eder')
    .addUserOption(option=> 
        option
        .setName('user')
        .setDescription('Kayıt edilecek kullanıcı')
        .setRequired(true)
    )
    .addStringOption(option=>
        option
        .setName('choice')
        .setDescription('Kayıt işlemi Türü')
        .setRequired(true)
        .addChoices(
            {name: 'man', value: 'man'},
            {name: 'woman', value: 'woman'},
            {name: 'nick', value: 'nick'},
            {name: 'record', value: 'record'},
            {name: 'unregister', value: 'unregister'},
        ),
    )
    .addStringOption(option=>
        option
        .setName('nickname')
        .setDescription('Kullanıcı adını değiştirir')
        .setRequired(false)
    ),
    async execute(interaction){
        try {
            

            const PM = new PermissionsManager(interaction)
            const sender = new messageSender(interaction)

            const fetchUser = interaction.options.getUser('user')
            const choice = interaction.options.getString('choice')
            const nickname = interaction.options.getString('nickname')

            const user =  await interaction.guild.members.fetch(fetchUser.id)
            
            if(!user) return await interaction.reply('Kullanıcı bulunamadı!')
            
 			// Yetki Kontrolü
			const IsRoles = await PM.isRoles();
			const IsOwner = await PM.isOwner();
			const IsAuthority = await PM.isAuthority(PM.flags.ReadMessageHistory, PM.flags.Administrator);

			
			const checks = [];
			if (PM.permissions.isRole) checks.push(IsRoles);
			if (PM.permissions.isOwners) checks.push(IsOwner);
			if (PM.permissions.isAuthority) checks.push(IsAuthority);

			const hasAtLeastOnePermission = checks.includes(true);
			
			if (!hasAtLeastOnePermission) return await interaction.reply("Yetersiz yetki!");
			
            const embed = new EmbedBuilder(sender.embed({
                title: 'Register',
                footer: { text: interaction.user.displayName, iconURL: interaction.user.avatarURL()},
            }))
            
            const { man, record, unregister, woman, isRegisterActive }= sender.config.register
            
            if(!isRegisterActive) return await interaction.reply("Register'ı aktif ediniz.")
            const nick = nickname ? `Ve kullanıcı adı **${nickname}** olarak değiştirildi`: ''

            if(choice==="nickname"){
                if(!nickname) return await interaction.reply('Nickname alanı boş!')
                await user.setNickname(nickname)
                embed.setDescription(`Kullanıcı adı ${nickname} olarak değiştirildi!`)
            }
            if(choice==="man"){
                man?.forEach(async (role) => {
                    if(!role) return
                    const targetRole = await user.roles.cache.has(role)
                    if(targetRole){
                        await user.roles.add(role)
                    }
                })
                if(nickname) await user.setNickname(nickname)
                embed.setDescription(`${fetchUser} adlı kullanıcı erkek olarak kayıt edildi. ${nick}`)
            }
            if(choice==="woman"){
                woman?.forEach(async (role) => {
                    if(!role) return
                    const targetRole = await user.roles.cache.has(role)
                    if(targetRole){
                        await user.roles.add(role)
                    }
                })
                if(nickname) await user.setNickname(nickname)
                embed.setDescription(`${fetchUser} adlı kullanıcı kadın olarak kayıt edildi. ${nick}`)

            }
            if(choice==="record"){
                record?.forEach(async (role) => {
                    if(!role) return
                    await user.roles.add(role)
                })
                if(nickname) await user.setNickname(nickname)
                embed.setDescription(`${fetchUser} adlı kullanıcı kayıt edildi. ${nick}`)

            }
            if(choice==="unregister"){
                unregister?.forEach(async (role) => {
                    if(!role) return
                    const targetRole = await user.roles.cache.has(role)
                    if(targetRole){
                        await user.roles.add(role)
                    }
                })

                const deletedRoles = []
                man.map(role=> deletedRoles.push(role))
                woman.map(role=> deletedRoles.push(role))
                record.map(role=> deletedRoles.push(role))
                
                await deletedRoles?.forEach(async (role) => {
                    const targetRole = await user.roles.cache.has(role)
                    if(targetRole){
                        await user.roles.remove(role)
                    }
                })

                if(nickname) await user.setNickname(nickname)
                embed.setDescription(`${fetchUser} adlı kullanıcı kayıtsıza atıldı. ${nick}`)

            }

            await interaction.reply({embeds: [embed]})
        } catch (error) {
            console.log('Hata: ', error.message)
        }
    }
}
const { ActivityType } = require('discord.js')
const path = require('path')
const fs = require('fs')

class Base {
    constructor(client, dir){
        this.client = client
        this.dir = dir
    }
    setFileName(target){
        const IPath = path.join(this.dir, target)
        return IPath
    }
    loadCommands(dir){
        try { 
            const files = fs.readdirSync(dir, { withFileTypes: true })

            const commandsList = []
            files.filter((file)=> file.name.endsWith('.js')).map((file)=> {
                const commandPath = path.join(dir, file.name)
                const commandFile = require(commandPath)
                commandsList.push(commandFile)
            })

            files.filter((file)=> !file.name.endsWith('.js')).map(file => {

                const filesPath = path.join(dir, file.name)

                fs.readdirSync(filesPath).filter(file => file.endsWith('.js')).forEach(command => {
                    const filePath = path.join(filesPath, command)
                    const commandFile = require(filePath)
                    commandsList.push(commandFile)
                })
            
            })

            commandsList.forEach((command)=>{
                if ('data' in command && 'execute' in command) {
                    this.client.commands.set(command.data.name, command)
                } else {
                    console.log(`[HATA] geçersiz yükleme.`)
                }
            })
            const commandSize = this.client.commands.size
            console.log(`${commandSize} tane komut başarıyla yüklendi.`)
        } catch (error) {
            console.log('Hata: ', error.message)
        }
    }
    loadsEvents(dir){
        const eventFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'))

        for (const file of eventFiles) {
            const filePath = path.join(dir, file)
            const event = require(filePath)
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, ActivityType))
            } else {
                client.on(event.name, (...args) => event.execute(...args, client))
            }
        }
    }
}

module.exports = {
    Base
}
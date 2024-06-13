const mongoose = require('mongoose')

function db(){
    const conn = mongoose.connect(process.env.MONGO_URI)
    .then(()=> console.log('BAĞLANDI'))
    .catch((err)=> console.log(err))
    return conn
}

module.exports = db
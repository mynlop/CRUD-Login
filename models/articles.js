let mongoose = require('mongoose')

//articulo shema
let articleSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    }
})

let Article = module.exports = mongoose.model('Article',articleSchema)
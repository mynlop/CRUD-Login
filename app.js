const express = require('express')
const path = require('path')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/mongoBase')
let db = mongoose.connection

//verifica la conexion
db.once('open',function(){
    console.log('Conectado a MongodDB')
})

//verificar si hay errores con la conexion a la DB
db.on('error',function(err){
    console.log(err)
})

//iniciando la app
const app = express()

// traer los modelos
let Article = require('./models/articles')

//asignando la vista
app.set('views', path.join(__dirname,'views'))
app.set('view engine','pug')

//ruta a la pagina raiz
app.get('/', function(req, res){
    Article.find({},function(err, articles){
        if(err){
            console.log(err)
        }else{
            res.render('index',{
                title: 'Hola',
                articles: articles
            })
        }
    })
})

//agregar una ruta
app.get('/articles/add',function(req,res){
    res.render('addArticle',{
        title: 'Agregar articulo'
    })
})

//iniciando server
app.listen(3000, function(){
    console.log("Servidor corriendo en el puerto 3000...")
})
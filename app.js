const express = require('express')
const path = require('path')
const mongoose = requiere('mongoose')

mongoose.connect('mongodb://localhost/mongoBase')
let db = mongoose.connection

//iniciando la app
const app = express()

//asignando la vista
app.set('views', path.join(__dirname,'views'))
app.set('view engine','pug')

//ruta a la pagina raiz
app.get('/', function(req, res){
    let articles = [
        {
            id : 1,
            title : 'Articulo uno',
            autor : 'Mynor',
            body : 'Este es el contenido del articulo uno.'
        },
        {
            id : 2,
            title : 'Articulo dos',
            autor : 'Santiago',
            body : 'Este es el contenido del articulo dos.'
        },
        {
            id : 3,
            title : 'Articulo tres',
            autor : 'Lopez',
            body : 'Este es el contenido del articulo tres.'
        }
    ]
    res.render('index',{
        title: 'Hola',
        articles: articles
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
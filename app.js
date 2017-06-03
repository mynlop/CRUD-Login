const express = require('express')
const path = require('path')

//iniciando la app
const app = express()

//asignando la vista
app.set('views', path.join(__dirname,'views'))
app.set('view engine','pug')

//ruta a la pagina raiz
app.get('/', function(req, res){
    res.render('index',{
        title: 'Hola'
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
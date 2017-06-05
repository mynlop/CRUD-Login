const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

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

// Body Parser
//  parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//asignar la carpeta publica
app.use(express.static(path.join(__dirname,'public')))

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

//ruta de post en guardar articulo
app.post('/articles/add',function(req,res){
    let article = Article()
    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body

    article.save(function(err){
        if(err){
            console.log(err)
            return
        }else{
            res.redirect('/')
        }

    })
})

//iniciando server
app.listen(3000, function(){
    console.log("Servidor corriendo en el puerto 3000...")
})
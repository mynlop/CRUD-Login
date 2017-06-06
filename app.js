const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')

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

// expres session 
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false
}))

//express messages
app.use(require('connect-flash')())
app.use(function(req,res,next){
    res.locals.messages = require('express-messages')(req, res)
    next()
})

//express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//ruta a la pagina raiz
app.get('/', function(req, res){
    Article.find({},function(err, articles){
        if(err){
            console.log(err)
        }else{
            res.render('index',{
                title: 'Articulos',
                articles: articles
            })
        }
    })
})

//obtener id del articulo
app.get('/article/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        res.render('article', {
            article: article
        })
    })
})

//generar formulario de edicion de x articulo
app.get('/article/edit/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        res.render('editArticle', {
            title: 'Editar Artiulo',
            article: article
        })
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
    req.checkBody('title','El tiulo es obligatorio.').notEmpty()
    req.checkBody('author','El autor es obligatorio.').notEmpty()
    req.checkBody('body','El cuerpo es obligatorio.').notEmpty()

    // get errors
    let errors = req.validationErrors()

    if(errors){
        res.render('addArticle', {
            title: 'Agregar Articulo',
            errors: errors
        })
    }else{
        let article = Article()
        article.title = req.body.title
        article.author = req.body.author
        article.body = req.body.body

        article.save(function(err){
            if(err){
                console.log(err)
                return
            }else{
                req.flash('success','Articulo agregado.')
                res.redirect('/')
            }

        })
    }
})

//ruta de update los cambios en x articulo
app.post('/article/edit/:id',function(req,res){
    let article = {}
    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body

    let query = {_id: req.params.id}
    Article.update(query, article, function(err){
        if(err){
            console.log(err)
            return
        }else{
            req.flash('success','Cambios realizados en el articulo.')
            res.redirect('/')
        }

    })
})

// eliminar un articulo
app.delete('/article/:id', function(req, res){
    let query = {_id: req.params.id}
    Article.remove(query, function(err){
        if(err){
            console.log(err)
        }
        res.send('Success')
    })
})

//iniciando server
app.listen(3000, function(){
    console.log("Servidor corriendo en el puerto 3000...")
})
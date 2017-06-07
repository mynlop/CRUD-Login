const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const config = require('./config/database')

mongoose.connect(config.database)
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

//configuracion de passport
require('./config/passport')(passport)
//passport
app.use(passport.initialize())
app.use(passport.session())

app.get('*', function(req, res, next){
    res.locals.user = req.user || null
    next()
})

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

//ruta a archivos
let articles = require('./routes/articles')
let users = require('./routes/users')
app.use('/articles',articles)
app.use('/users',users)

//iniciando server
app.listen(3000, function(){
    console.log("Servidor corriendo en el puerto 3000...")
})
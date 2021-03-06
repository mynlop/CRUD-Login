const express = require('express')
const router = express.Router()

//traer el modelo Article
let Article = require('../models/articles')
//traer el modelo User
let User = require('../models/user')

//generar formulario de edicion de x articulo
router.get('/edit/:id', ensureAuthenticated, function(req, res){
    Article.findById(req.params.id, function(err, article){
        if(article.author != req.user._id){
            req.flash('danger', 'No eres el creador de este articulo')
            res.redirect('/')
        }
        res.render('editArticle', {
            title: 'Editar Artiulo',
            article: article
        })
    })
})

//agregar una ruta
router.get('/add', ensureAuthenticated, function(req,res){
    res.render('addArticle',{
        title: 'Agregar articulo'
    })
})

//ruta de post en guardar articulo
router.post('/add',function(req,res){
    req.checkBody('title','El tiulo es obligatorio.').notEmpty()
    // req.checkBody('author','El autor es obligatorio.').notEmpty()
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
        article.author = req.user._id
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
router.post('/edit/:id',function(req,res){
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
router.delete('/:id', function(req, res){
    if(!req.user._id){
        res.status(500).send()
    }
    
    let query = {_id: req.params.id}

    Article.findById(req.params.id, function(err, article){
        if(article.author != req.user._id ){
            res.status(500).send()
        }else{
            Article.remove(query, function(err){
                if(err){
                    console.log(err)
                }
                res.send('Success')
            })
        }
    })

})

//obtener id del articulo
router.get('/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        User.findById(article.author, function(err, user){
            res.render('article', {
                article: article,
                author: user.name
            })
        })
    })
})

// control de acceso
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }else{
        req.flash('danger', 'Por favor inicia sesion.')
        res.redirect('/users/login')
    }
}

module.exports = router
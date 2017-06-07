const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

//modelo del usuario
let User = require('../models/user')

//formulario de registro
router.get('/register',function(req, res){
    res.render('register')
})

//proceso de registro de usuario
router.post('/register', function(req, res){
    const name = req.body.name
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password
    const password2 = req.body.password2

    req.checkBody('name', 'Nombre requerido').notEmpty()
    req.checkBody('email', 'Correo Electronico requerido').notEmpty()
    req.checkBody('email', 'El correo no es valido').isEmail()
    req.checkBody('username', 'Nombre de usuario requerido').notEmpty()
    req.checkBody('password','Contraseña requerida').notEmpty()
    req.checkBody('password2', 'Las constraseñas no son iguales').equals(req.body.password)

    let errors = req.validationErrors()

    if(errors){
        res.render('register',{
            errors: errors
        })
    }else{
        let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        })
        bcrypt.genSalt(10,function(err, salt){
            bcrypt.hash(newUser.password , salt, function(err, hash){
                if(err){
                    console.log(err)
                }else{
                    newUser.password = hash
                    newUser.save(function(err){
                        if(err){
                            console.log(err)
                            return
                        }else{
                            req.flash('success', 'Registro completado, ahora puedes acceder al sistema con tu usuario.')
                            res.redirect('/users/login')
                        }
                    })
                }
            })
        })
    }
})

//formulario login
router.get('/login', function(req, res){
    res.render('login')
})

// proceso login
router.post('/login', function(req, res, next){
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

//cerrar sesion
router.get('/logout', function(req, res){
    req.logout()
    req.flash('success', 'Has cerrado sesion')
    res.redirect('/users/login')
})

module.exports = router
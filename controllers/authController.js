const passport = require('passport');
const Usuarios = require('../models/Usuarios'); 
const crypto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op; 
const bcrypt = require('bcrypt-nodejs');  
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/', 
    failureRedirect: '/iniciar-sesion',
    failureFlash: true , 
    badRequestMessage: 'Ambos campos son obligatorios'
});

//Función para revisar si el usuarios está logueado
exports.usuarioAutenticado = (req, res, next) => {
    //Si el usuario está autenticado, adelante 
    if (req.isAuthenticated()) {
        return next();
    }

    //Si no está autentucado, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

//Función para cerrar sesión 
exports.cerrarSesion = (req,res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion') 
    }); 
}

//Genera un token si el usuario es válido
exports.enviarToken = async (req, res) => {
    
    try {
        //Verificar que el usuario existe 
        const { email } = req.body; 
        const usuario = await Usuarios.findOne( { where: { email } }); 
    
        //Si no existe el usuario 
        if(!usuario) {
            req.flash('error', 'No existe cuenta asociada con ese correo'); 
            res.redirect('/reestablecer'); 
        }

        //Usuario existe 
        usuario.token = crypto.randomBytes(20).toString('hex'); 
        usuario.expiracion = Date.now() + 3600000;

        //Guardar token y expiración en la base de datos 
        await usuario.save(); 

        //Url de reset
        const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
        
        //Envia el correo con el token 
        await enviarEmail.enviar( {
            usuario, 
            subject: 'Password Reset', 
            resetUrl, 
            archivo: 'reestablecer-password'
        }); 

        //Terminar la acción 
        req.flash('correcto', 'Se envió un mensaje a tu correo'); 
        res.redirect('/iniciar-sesion'); 
    } catch (error) {
        console.log(error); 
        return; 
    }
}

exports.validarToken = async(req, res) => {
    const token = req.params.token;

    try {
        const usuario = await Usuarios.findOne( { where: { token } });
        
        //Si no encuentra el usuario 
        if (!usuario) { 
            req.flash('error', 'No válido'); 
            res.redirect('/reestablecer'); 
        }

        //Formulario para generar el password 
        res.render('resetPassword', {
            nombrePagina: 'Reestablecer Contraeña'
        }) 

    } catch (error) {
        console.log(error); 
        return; 
    }
}

//Cambia el password por uno nuevo
exports.actualizarPassword = async (req, res) => {
    const token = req.params.token;
    
    try {
        //Verifica el token válido y la fecha de expiración
        const usuario = await Usuarios.findOne( { 
            where: { 
                token, 
                expiracion: {
                    [Op.gte]: Date.now()
                } 
            } 
        }); 

        //Verificamos si el usuario existe 
        if(!usuario) {
            req.flash('error', 'No válido'); 
            res.redirect('/reestablecer'); 
        }

        const password = req.body.password; 
        //Hashear el nuevo password 
        usuario.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10)); 
        usuario.token = null; 
        usuario.expiracion = null; 

        //Guardamos el nuevo password
        await usuario.save();

        req.flash('correcto', 'Tu password se ha modificado correctamente'); 
        res.redirect('/iniciar-sesion')

    } catch (error) {
        console.log(error);
        return; 
    }
}

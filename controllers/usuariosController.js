const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req,res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear cuenta en UpTask'
    })
};

exports.formIniciarSesion = (req,res) => {
    const { error } = res.locals.mensajes; 
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesión en UpTask', 
        error
    })
};

exports.crearCuenta = async (req, res) => {
    //Leer los datos
    const { email, password } = req.body; 

    //Crear el usuario
    try {
        await Usuarios.create({ email, password })
        
        //Crear una url de confirmar 
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
        
        //Crear el objeto de usuario 
        const usuario = {
            email
        }
        
        //Enviar email
        await enviarEmail.enviar( {
            usuario, 
            subject: 'Confirmar tu Cuenta Uptask', 
            confirmarUrl, 
            archivo: 'confirmar-cuenta'
        }); 

        //Redirigir al usuario 
        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta'); 
        res.redirect('/iniciar-sesion'); 
    } catch (error) {
        console.log(error); 
        
        req.flash('error', error.errors.map(error => error.message)); 

        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en Uptask',
            email,
            password
        })
    }
}; 

exports.formRestablecerPassword = (req,res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu contraseña'
    })
}

//Confirmar la Cuenta
exports.confirmarCuenta = async (req, res) => {
    const email = req.params.email; 

    try {
        const usuario = await Usuarios.findOne( { where: { email } }); 

        // Si no hay un usuario con el email asociado
        if(!usuario) {
            req.flash('error', 'No válido'); 
            res.redirect('/crear-cuenta'); 
        }

        //Cambiar a activo el estado del usuario
        usuario.activo = 1; 

        await usuario.save();

        req.flash('correcto', 'Cuenta activada exitosamente'); 
        res.redirect('/iniciar-sesion'); 

    } catch (error) {
        console.log(error); 
        return; 
    }
}
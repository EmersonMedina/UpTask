const express = require('express'); 
const router = express.Router(); 

//Importar express validator
const { body } = require('express-validator'); 

//importar el controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function() {
    //Ruta para el home 
    router.get('/', 
        authController.usuarioAutenticado,
        proyectosController.proyectosHome
    ); 
    
    router.get('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto
    ); 
    
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(), 
        proyectosController.nuevoProyecto
    );
    
    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(), 
        proyectosController.actualizarProyecto
    );
    
    //Listar proyecto
    router.get('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl
    ); 
    
    //Actualizar el proyecto
    router.get('/proyecto/editar/:id', 
        authController.usuarioAutenticado,
        proyectosController.formularioEditar
    ); 

    //Eliminar el proyecto
    router.delete('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto
    ); 

    //TAREAS
    //Agregar tarea a un proyecto
    router.post('/proyectos/:url', 
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    ); 

    //Actualizar una tarea
    router.patch('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea
    ); 

    //Eliminar una tarea
    router.delete('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    ); 

    //Crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta); 
    router.post('/crear-cuenta', usuariosController.crearCuenta); 
    //Confirmar cuenta 
    router.get('/confirmar/:email', usuariosController.confirmarCuenta); 
    
    //Iniciar sesión
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion); 
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //Cerrar sesión
    router.get('/cerrar-sesion', authController.cerrarSesion);

    //Reestablecer contraseña
    router.get('/reestablecer', usuariosController.formRestablecerPassword); 
    router.post('/reestablecer', authController.enviarToken); 
    router.get('/reestablecer/:token', authController.validarToken); 
    router.post('/reestablecer/:token', authController.actualizarPassword); 

   
    return router; 
}
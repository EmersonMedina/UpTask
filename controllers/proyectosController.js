const Proyectos = require('../models/Proyectos'); 
const Tareas = require('../models/Tareas'); 

exports.proyectosHome = async (req, res) => {
    try {
            const usuarioId = res.locals.usuario.id; 
            const proyectos =  await Proyectos.findAll({ where: { usuarioId } }); 

        res.render('index', {
            nombrePagina: 'Proyectos', 
            proyectos
        });    
    } catch (error) {
        console.log(error); 
    }
    
}

exports.formularioProyecto = async (req, res) => {
    try {
        const usuarioId = res.locals.usuario.id; 
        const proyectos =  await Proyectos.findAll({ where: { usuarioId } });  

        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto', 
            proyectos
        });    
    } catch (error) {
        
    }
    
}

exports.nuevoProyecto = async (req, res) => {
    //Validar que tengamos algo en el input 
    const { nombre } = req.body; 
    
    let errores = []; 

    if (!nombre) {
        errores.push({ 
            texto: 'Agrega un nombre al proyecto' 
        })
    }

    //Si hay errores
    if (errores.length > 0) {
        try {
            const usuarioId = res.locals.usuario.id; 
            const proyectos =  await Proyectos.findAll({ where: { usuarioId } }); 

            res.render('nuevoProyecto', { 
                nombrePagina : 'Nuevo Proyecto', 
                errores,
                proyectos
            })
        } catch (error) {
            
        }
    } else {
        try {
            const usuarioId = res.locals.usuario.id; 
            //Insertar en la BD
            await Proyectos.create( { nombre, usuarioId } ); 
            //Redireccionar 
            res.redirect('/'); 
        } catch (error) {
            console.log(error)
        }
    }
}

exports.proyectoPorUrl = async (req, res, next) => {
    try {
        //TODO: Cambiar por Promises.all
        const usuarioId = res.locals.usuario.id; 
        const proyectosPromise = Proyectos.findAll({ where: { usuarioId } }); 

        const proyectoPromise = Proyectos.findOne({ 
            where: {
                url: req.params.url,
                usuarioId
            }
        }); 

        const [ proyectos, proyecto ] = await Promise.all([ proyectosPromise, proyectoPromise ]); 

        if (!proyecto) {
            return next(); 
        }

        //Obtener las tareas del proyecto
        const tareas = await Tareas.findAll( { 
            where: { proyectoId: proyecto.id }, 
            // include: { model: Proyectos } para incluir el proyecto que pertenece a esta tarea
        })

        //Render a la vista
        res.render('tareas', { 
            nombrePagina: 'Tareas del proyecto', 
            proyectos,
            proyecto, 
            tareas 
        });
    } catch (error) {
        console.log(error);
    }
}

exports.formularioEditar = async (req, res) => {
    try {
        const usuarioId = res.locals.usuario.id; 
        const proyectosPromise = Proyectos.findAll({ where: { usuarioId } }); 

        const proyectoPromise = Proyectos.findOne({ 
            where: {
                id: req.params.id,
                usuarioId
            }
        }); 

        const [ proyectos, proyecto ] = await Promise.all([ proyectosPromise, proyectoPromise ]); 

        res.render('nuevoProyecto', {
            nombrePagina: 'Editar Proyecto',
            proyecto, 
            proyectos
        });
    } catch (error) {
        console.log(error); 
    }
}

exports.actualizarProyecto = async (req, res) => {
    //Validar que tengamos algo en el input 
    const { nombre } = req.body; 
    
    let errores = []; 

    if (!nombre) {
        errores.push({ 
            texto: 'Agrega un nombre al proyecto' 
        })
    }
    console.log(errores.length); 

    //Si hay errores
    if (errores.length > 0) {
        try {
            const usuarioId = res.locals.usuario.id; 
            const proyectos =  await Proyectos.findAll({ where: { usuarioId } }); 

            res.render('nuevoProyecto', { 
                nombrePagina : 'Nuevo Proyecto', 
                errores,
                proyectos
            })
        } catch (error) {
            console.log(error);
        }
    } else {
        try {
            //Insertar en la BD
            await Proyectos.update( 
                { nombre: nombre }, 
                { where: { id: req.params.id } } 
            ); 
            //Redireccionar 
            res.redirect('/'); 
        } catch (error) {
            console.log(error)
        }
    }
}

exports.eliminarProyecto = async (req, res, next) => {
    //Podemos usar query o params  
    const { urlProyecto } = req.query; 
     
    try {
        //Insertar en la BD
        const resultado = await Proyectos.destroy(
            { where: { url: urlProyecto } } 
        ); 

        if (!resultado) {
            return next(); 
        }
        
        res.status(200).send('Proyecto eliminado correctamente');
    } catch (error) {
        console.log(error)
    }
}
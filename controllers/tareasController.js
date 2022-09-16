const Tareas = require('../models/Tareas'); 
const Proyectos = require('../models/Proyectos'); 

exports.agregarTarea = async (req, res, next) => {

    const { tarea } = req.body; 

    let errores = []; 

    if (!tarea) {
        errores.push({ 
            texto: 'Agrega un nombre a la tarea' 
        })
    }

    //Si hay errores
    if (errores.length > 0) {
        try {
            const proyectosPromise = await Proyectos.findAll(); 

            //Obtenemos el proyecto actual 
            const proyectoPromise = Proyectos.findOne( { 
                where: { url: req.params.url } 
            })
        
            const [ proyectos, proyecto ] = await Promise.all([ proyectosPromise, proyectoPromise ]); 

            if (!proyecto) {
                return next(); 
            }

            res.render('tareas', { 
                nombrePagina : 'Tareas del proyecto', 
                errores,
                proyecto,
                proyectos, 
            })
        } catch (error) {
            console.log(error); 
        }
    } else {
        try {
            //Obtener el proyecto 
            const proyecto = await Proyectos.findOne( { 
                where: { url: req.params.url } 
            })
            //Insertar en la BD

            //Estado 0 = incompleto y ID de proyecto
            const estado = 0; 
            const proyectoId = proyecto.id; 

            const resultado = await Tareas.create( { tarea, estado, proyectoId } ); 

            if (!resultado) {
                return next(); 
            }

            //Redireccionar 
            res.redirect(`/proyectos/${req.params.url}`); 
        } catch (error) {
            console.log(error); 
            return next();
        }
    }
}; 

exports.cambiarEstadoTarea = async (req, res, next) => {
    const { id } = req.params; 
    
    try {
        const tarea = await Tareas.findOne({ 
            where: { id: id}
        }); 

        //Cambiar el estado
        let estado = 0; 
        if (tarea.estado == estado) {
            estado = 1; 
        }

        tarea.estado = estado; 

        const resultado = await tarea.save();

        if(!resultado) return next(); 

        res.status(200).send('Actualizado'); 
    } catch (error) {
        console.log(tarea); 
        return next(); 
    }
}; 

exports.eliminarTarea = async (req, res, next) => {
    const { id } = req.params; 

    try {
        const resultado = await Tareas.destroy({ where: { id } }); 
        
        if(!resultado) { 
            return next(); 
        }
        
        res.status(200).send('Tarea eliminada exitosamente'); 
    } catch (error) {
        console.log(error); 
        return next(); 
    }
}; 

const Sequelize = require('sequelize');
const db = require('../config/db'); 
const slug = require('slug'); 
const shortid = require('shortid'); 


const Proyectos = db.define('proyectos', { 
    id: {
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
    }, 
    nombre: {
        type: Sequelize.STRING(100)
    }, 
    url: {
        type: Sequelize.STRING(100)
    }
}, {
    hooks: {
        beforeCreate(proyecto) {
            const url = slug(proyecto.nombre); 
            
            proyecto.url = `${url}-${shortid.generate()}`; 
        } 
    }
}); 

module.exports = Proyectos; 

//Se tiene que hacer de esta forma, de lo cotrario daba error: https://github.com/sequelize/sequelize/issues/4696
const Usuarios = require('./Usuarios'); 
Proyectos.belongsTo(Usuarios); 


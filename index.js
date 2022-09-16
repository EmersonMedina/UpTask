const express = require ('express'); 
const router = require('./routes/index.js'); 
const path = require('path');
const  bodyParser = require('body-parser'); 
const flash = require('connect-flash'); 
const session = require('express-session'); 
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// Helpers con algunas funciones 
const helpers = require('./helpers'); 
//Crear la conexión
const db = require('./config/db'); 

//Importar el modelo 
require('./models/Usuarios'); 
require('./models/Proyectos'); 
require('./models/Tareas'); 

db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error))

//Crear una app de express
const app = express(); 

//Donde cargar los archivos estáticos
app.use(express.static('public')); 

//Habilitar pug
app.set('view engine', 'pug'); 

//Habilitar body parser para leer datos del formulario 
app.use(bodyParser.urlencoded( { extended:true } ));

//Añadir la carpeta de las vistas 
app.set('views', path.join(__dirname, './views'));

//Agregar flash messages
app.use(flash()); 

app.use(cookieParser());

// Sesiones nos permiten navegar entre distintas páginas sin volvernos a autenticar
app.use(session({
    secret: 'supersecreto', 
    resave: false, 
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Pasar var dump a la aplicación
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user || null} ; 
    next();
}) 

//Agregrando el enrutador
app.use('/', router()); 
    
app.listen(3000, () => {
    console.log('Servidor funcionando');
}); 


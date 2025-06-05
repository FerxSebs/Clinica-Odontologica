//importar el modulo express, que es un framework para construir aplicaciones web en Node.js
import express from 'express';
//llamamos el archivo que se encuentra en la carpeta de rutas
import router from './routes/index.js';
import db from './config/db.js';
import session from 'express-session';
import { Paciente, Personal, Cita, Servicio, Testimonio, HistorialClinico } from './models/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { insertarServiciosDefault } from './controllers/servicioController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Configuraciones
app.set('view engine', 'pug');
app.set('views', './views');

// Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Configurar archivos estáticos con ruta absoluta
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesiones
app.use(session({
    secret: 'mi_secreto',
    resave: false,
    saveUninitialized: false
}));

// Middleware global para variables locales
app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario || null;
    res.locals.nombreSitio = "Clínica Dental";
    res.locals.year = new Date().getFullYear();
    next();
});

// Verificar conexión a la base de datos
db.authenticate()
    .then(() => console.log('Conexión correcta a la Base de Datos'))
    .catch(error => console.error('Error de conexión:', error));

// Agregar router - debe ir después de todos los middlewares
app.use('/', router);

// Manejo de errores 404 - debe ir después del router
app.use((req, res, next) => {
    res.status(404).render('error', {
        pagina: 'Página no encontrada',
        mensaje: 'La página que buscas no existe',
        error: {}
    });
});

// Manejo de errores generales - debe ser el último middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(error.status || 500).render('error', {
        pagina: 'Error',
        mensaje: error.message || 'Ha ocurrido un error en el servidor',
        error: process.env.NODE_ENV === 'development' ? error : {}
    });
});

//define el puerto en el que la aplicación escuchará las solicitudes
//usa el valor definido en la variable de entorno PORT
// o el puerto 3000 si no está definida (puerto por defecto)
app.listen(port, () => {
    console.log(`El servidor está funcionando en el puerto ${port}`);
});















//importa el framework express, que permiyte creaar un servidor y manejar rutas
import express from 'express';
import { 
    paginaInicio,
    paginaServicios,
    paginaHistorial
} from '../controllers/paginasController.js';
import {
    registrarUsuario,
    autenticarUsuario,
    cerrarSesion
} from '../controllers/authController.js';
import {
    mostrarTestimonios,
    guardarTestimonio,
    adminTestimonios
} from '../controllers/testimonialController.js';
import {
    obtenerServicios,
    crearServicio,
    actualizarServicio,
    eliminarServicio
} from '../controllers/servicioController.js';
import {
    mostrarFormularioCita,
    crearCita,
    cancelarCita
} from '../controllers/citaController.js';
import { mostrarPerfil } from '../controllers/perfilController.js';
import { protegerRuta, esAdmin } from '../middleware/auth.js';

//crea una instancia de express
//este enrutador se utilizara para definir todas las rutas del sitio web
const router = express.Router();

// Rutas públicas
router.get('/', paginaInicio);
router.get('/servicios', paginaServicios);

// Rutas de autenticación
router.get('/login', (req, res) => res.render('auth/login', { pagina: 'Iniciar Sesión' }));
router.post('/login', autenticarUsuario);
router.get('/registro', (req, res) => res.render('auth/registro', { pagina: 'Crear Cuenta' }));
router.post('/registro', registrarUsuario);
router.get('/cerrar-sesion', cerrarSesion);

// Rutas protegidas
router.get('/perfil', protegerRuta, mostrarPerfil);

// Rutas de citas
router.get('/citas', protegerRuta, mostrarFormularioCita);
router.post('/citas', protegerRuta, crearCita);
router.delete('/citas/:id', protegerRuta, cancelarCita);

// Rutas de administración
router.get('/admin', protegerRuta, esAdmin, (req, res) => {
    res.render('admin/dashboard', {
        pagina: 'Panel de Administración',
        usuario: req.session.usuario
    });
});

// Rutas de servicios (admin)
router.get('/admin/servicios', protegerRuta, esAdmin, obtenerServicios);
router.post('/admin/servicios', protegerRuta, esAdmin, crearServicio);
router.put('/admin/servicios/:id', protegerRuta, esAdmin, actualizarServicio);
router.delete('/admin/servicios/:id', protegerRuta, esAdmin, eliminarServicio);

// Rutas de testimonios
router.get('/testimonios', mostrarTestimonios);
router.post('/testimonios', protegerRuta, guardarTestimonio);
router.get('/admin/testimonios', protegerRuta, esAdmin, adminTestimonios);

// Ruta de historial clínico
router.get('/historial', protegerRuta, paginaHistorial);

//============EXPORTAR=================
export default router;

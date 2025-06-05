import Paciente from '../models/Paciente.js';
import Personal from '../models/Personal.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

const registrarUsuario = async (req, res) => {
    const { 
        numero_identificacion,
        nombre,
        apellido,
        email,
        password,
        telefono,
        fecha_nacimiento,
        direccion
    } = req.body;
    
    try {
        // Verificar si ya existe un paciente con esa identificación o email
        const existePaciente = await Paciente.findOne({ 
            where: { 
                [Op.or]: [
                    { numero_identificacion },
                    { email }
                ]
            } 
        });

        if (existePaciente) {
            return res.render('auth/registro', {
                pagina: 'Crear Cuenta',
                error: 'Ya existe un usuario con esa identificación o email',
                valores: req.body
            });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el paciente
        const paciente = await Paciente.create({
            numero_identificacion,
            nombre,
            apellido,
            email,
            password: hashedPassword,
            telefono,
            fecha_nacimiento,
            direccion
        });

        // Iniciar sesión
        req.session.usuario = {
            numero_identificacion: paciente.numero_identificacion,
            nombre: paciente.nombre,
            apellido: paciente.apellido,
            tipo: 'paciente'
        };

        return res.redirect('/');
        
    } catch (error) {
        console.log('Error en el registro:', error);
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            error: 'Error al crear la cuenta',
            valores: req.body
        });
    }
};

const autenticarUsuario = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        console.log('Intentando autenticar usuario con email:', email);

        // Primero intentar autenticar como paciente
        const paciente = await Paciente.findOne({ where: { email } });
        
        if (paciente) {
            console.log('Usuario encontrado como paciente');
            const passwordValido = await bcrypt.compare(password, paciente.password);
            if (!passwordValido) {
                return res.render('auth/login', {
                    pagina: 'Iniciar Sesión',
                    error: 'Contraseña incorrecta'
                });
            }

            req.session.usuario = {
                numero_identificacion: paciente.numero_identificacion,
                nombre: paciente.nombre,
                apellido: paciente.apellido,
                tipo: 'paciente'
            };

            return res.redirect('/');
        }

        // Si no es paciente, intentar autenticar como personal
        console.log('Buscando usuario como personal');
        const personal = await Personal.findOne({ where: { email } });
        
        if (!personal) {
            console.log('Usuario no encontrado en ninguna tabla');
            return res.render('auth/login', {
                pagina: 'Iniciar Sesión',
                error: 'El usuario no existe'
            });
        }
        
        console.log('Usuario encontrado como personal');
        const passwordValido = await bcrypt.compare(password, personal.password);
        if (!passwordValido) {
            return res.render('auth/login', {
                pagina: 'Iniciar Sesión',
                error: 'Contraseña incorrecta'
            });
        }
        
        console.log('Contraseña válida para personal');
        req.session.usuario = {
            numero_identificacion: personal.numero_identificacion,
            nombre: personal.nombre,
            apellido: personal.apellido,
            tipo: 'personal',
            especialidad: personal.especialidad
        };

        // Redirigir según la especialidad
        if (personal.especialidad === 'admin') {
            console.log('Redirigiendo a admin');
            return res.redirect('/admin');
        }
        console.log('Redirigiendo a citas');
        return res.redirect('/citas');

    } catch (error) {
        console.error('Error en la autenticación:', error);
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            error: 'Error al iniciar sesión'
        });
    }
};

const cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

export {
    registrarUsuario,
    autenticarUsuario,
    cerrarSesion
}; 
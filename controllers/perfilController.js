import Cita from '../models/Cita.js';
import Paciente from '../models/Paciente.js';
import Personal from '../models/Personal.js';
import Servicio from '../models/Servicio.js';

const mostrarPerfil = async (req, res) => {
    try {
        const usuario = req.session.usuario;
        console.log('Usuario en sesión:', usuario);

        // Configurar la consulta base para las citas
        const citasQuery = {
            attributes: ['cita_id', 'fecha_hora', 'estado'],
            include: [
                {
                    model: Servicio,
                    as: 'servicio',
                    attributes: ['nombre_servicio', 'precio', 'duracion_minutos']
                }
            ],
            order: [['fecha_hora', 'ASC']]
        };

        // Ajustar la consulta según el tipo de usuario
        if (usuario.tipo === 'personal') {
            citasQuery.where = {
                numero_identificacion_personal: usuario.numero_identificacion
            };
            citasQuery.include.push({
                model: Paciente,
                as: 'paciente_cita',
                attributes: ['nombre', 'apellido', 'telefono', 'email']
            });
        } else {
            citasQuery.where = {
                numero_identificacion_paciente: usuario.numero_identificacion
            };
            citasQuery.include.push({
                model: Personal,
                as: 'personal_cita',
                attributes: ['nombre', 'apellido', 'especialidad']
            });
        }

        // Obtener las citas
        const citas = await Cita.findAll(citasQuery);
        console.log('Citas encontradas:', citas.length);

        // Renderizar la vista de perfil
        res.render('perfil', {
            pagina: 'Mi Perfil',
            usuario,
            citas,
            error: null
        });
    } catch (error) {
        console.error('Error al mostrar perfil:', error);
        res.render('perfil', {
            pagina: 'Mi Perfil',
            usuario: req.session.usuario,
            citas: [],
            error: 'Error al cargar la información del perfil'
        });
    }
};

export {
    mostrarPerfil
}; 
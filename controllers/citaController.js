import Cita from '../models/Cita.js';
import Paciente from '../models/Paciente.js';
import Personal from '../models/Personal.js';
import Servicio from '../models/Servicio.js';
import { Op } from 'sequelize';

const mostrarFormularioCita = async (req, res) => {
    try {
        console.log('Iniciando mostrarFormularioCita');
        const { servicioId } = req.params;
        
        // Obtener servicios
        const servicios = await Servicio.findAll({
            order: [['nombre_servicio', 'ASC']]
        });
        console.log('Servicios encontrados:', servicios.length);

        // Obtener personal
        const personal = await Personal.findAll({
            where: {
                especialidad: 'odontologo'
            },
            order: [['nombre', 'ASC']]
        });
        console.log('Personal encontrado:', personal.length);

        // Obtener las citas del usuario
        let citas = [];
        if (req.session.usuario.tipo === 'personal') {
            citas = await Cita.findAll({
                where: {
                    numero_identificacion_personal: req.session.usuario.numero_identificacion,
                    estado: 'pendiente'
                },
                include: [
                    {
                        model: Paciente,
                        as: 'paciente_cita',
                        attributes: ['nombre', 'apellido', 'telefono']
                    },
                    {
                        model: Servicio,
                        as: 'servicio',
                        attributes: ['nombre_servicio']
                    }
                ],
                order: [['fecha_hora', 'ASC']]
            });
        } else {
            citas = await Cita.findAll({
                where: {
                    numero_identificacion_paciente: req.session.usuario.numero_identificacion,
                    estado: 'pendiente'
                },
                include: [
                    {
                        model: Personal,
                        as: 'personal_cita',
                        attributes: ['nombre', 'apellido', 'especialidad']
                    },
                    {
                        model: Servicio,
                        as: 'servicio',
                        attributes: ['nombre_servicio']
                    }
                ],
                order: [['fecha_hora', 'ASC']]
            });
        }

        // Si viene de la página de servicios, obtener el servicio seleccionado
        let servicioSeleccionado = null;
        if (servicioId) {
            servicioSeleccionado = await Servicio.findByPk(servicioId);
        }

        console.log('Renderizando vista con:', {
            serviciosLength: servicios.length,
            personalLength: personal.length,
            citasLength: citas.length,
            servicioSeleccionado: servicioSeleccionado ? servicioSeleccionado.nombre_servicio : null
        });

        res.render('citas', {
            pagina: 'Agendar Cita',
            citas,
            servicios,
            personal,
            servicioSeleccionado,
            usuario: req.session.usuario
        });
    } catch (error) {
        console.error('Error en mostrarFormularioCita:', error);
        res.render('citas', {
            pagina: 'Agendar Cita',
            error: 'Error al cargar el formulario de citas',
            citas: [],
            servicios: [],
            personal: [],
            usuario: req.session.usuario
        });
    }
};

const crearCita = async (req, res) => {
    const { fecha, hora, servicio_id, personal_id } = req.body;
    const { numero_identificacion } = req.session.usuario;

    try {
        // Validar que la fecha y hora sean válidas
        const fechaHora = new Date(`${fecha} ${hora}`);
        const ahora = new Date();
        
        if (fechaHora < ahora) {
            throw new Error('No puedes agendar citas en fechas pasadas');
        }

        // Validar el día de la semana
        const diaSemana = fechaHora.getDay(); // 0 = Domingo, 6 = Sábado
        if (diaSemana === 0) {
            throw new Error('No hay servicio los domingos');
        }

        // Validar el horario según el día
        const hora24 = parseInt(hora.split(':')[0]);
        if (diaSemana === 6) { // Sábado
            if (hora24 < 7 || hora24 >= 12) {
                throw new Error('Los sábados solo atendemos de 7:00 AM a 12:00 PM');
            }
        } else { // Lunes a Viernes
            if (hora24 < 8 || hora24 >= 19) {
                throw new Error('De lunes a viernes atendemos de 8:00 AM a 7:00 PM');
            }
        }

        // Verificar si ya existe una cita en esa fecha y hora
        const citaExistente = await Cita.findOne({
            where: {
                fecha_hora: fechaHora,
                numero_identificacion_personal: personal_id,
                estado: 'pendiente'
            }
        });

        if (citaExistente) {
            throw new Error('Ya existe una cita agendada para esta fecha y hora');
        }

        // Crear la cita
        await Cita.create({
            fecha_hora: fechaHora,
            numero_identificacion_paciente: numero_identificacion,
            numero_identificacion_personal: personal_id,
            servicio_id,
            estado: 'pendiente'
        });

        res.redirect('/perfil');
    } catch (error) {
        console.error('Error en crearCita:', error);
        
        // Recuperar los datos necesarios para re-renderizar el formulario
        const [servicios, personal] = await Promise.all([
            Servicio.findAll({
                order: [['nombre_servicio', 'ASC']]
            }),
            Personal.findAll({
                where: {
                    especialidad: {
                        [Op.ne]: 'admin'
                    }
                },
                order: [['nombre', 'ASC']]
            })
        ]);

        res.render('citas', {
            pagina: 'Agendar Cita',
            error: error.message || 'Error al agendar la cita',
            servicios,
            personal,
            usuario: req.session.usuario,
            citas: []
        });
    }
};

const cancelarCita = async (req, res) => {
    const { id } = req.params;

    try {
        const cita = await Cita.findByPk(id);
        if (!cita) {
            return res.status(404).json({ mensaje: 'Cita no encontrada' });
        }

        // Solo permitir cancelar si la cita está pendiente
        if (cita.estado !== 'pendiente') {
            return res.status(400).json({ mensaje: 'Solo se pueden cancelar citas pendientes' });
        }

        // Actualizar el estado a cancelada
        cita.estado = 'cancelada';
        await cita.save();

        res.json({ mensaje: 'Cita cancelada correctamente' });
    } catch (error) {
        console.error('Error al cancelar cita:', error);
        res.status(500).json({ mensaje: 'Error al cancelar la cita' });
    }
};

const actualizarEstadoCita = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const cita = await Cita.findByPk(id);
        if (!cita) {
            return res.status(404).json({ mensaje: 'Cita no encontrada' });
        }

        cita.estado = estado;
        await cita.save();

        res.json({ mensaje: 'Estado actualizado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al actualizar el estado' });
    }
};

const eliminarCita = async (req, res) => {
    const { id } = req.params;

    try {
        const cita = await Cita.findByPk(id);
        if (!cita) {
            return res.status(404).json({ mensaje: 'Cita no encontrada' });
        }

        await cita.destroy();
        res.json({ mensaje: 'Cita eliminada correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al eliminar la cita' });
    }
};

export {
    mostrarFormularioCita,
    crearCita,
    cancelarCita,
    actualizarEstadoCita,
    eliminarCita
}; 
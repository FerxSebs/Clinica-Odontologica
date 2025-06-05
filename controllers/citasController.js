import { Cita } from '../models/Cita.js';
import { Paciente } from '../models/Paciente.js';

const crearCita = async (req, res) => {
    const { fecha, hora, servicio, pacienteId } = req.body;

    try {
        // Verificar que el paciente existe
        const paciente = await Paciente.findByPk(pacienteId);
        if (!paciente) {
            return res.status(404).json({ mensaje: 'Paciente no encontrado' });
        }

        // Crear la cita
        const cita = await Cita.create({
            fecha,
            hora,
            servicio,
            pacienteId,
            estado: 'pendiente'
        });

        res.json({
            mensaje: 'Cita creada correctamente',
            cita
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al crear la cita' });
    }
};

const actualizarCita = async (req, res) => {
    const { id } = req.params;
    const { fecha, hora, servicio, estado } = req.body;

    try {
        const cita = await Cita.findByPk(id);
        if (!cita) {
            return res.status(404).json({ mensaje: 'Cita no encontrada' });
        }

        // Actualizar la cita
        await cita.update({
            fecha: fecha || cita.fecha,
            hora: hora || cita.hora,
            servicio: servicio || cita.servicio,
            estado: estado || cita.estado
        });

        res.json({
            mensaje: 'Cita actualizada correctamente',
            cita
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al actualizar la cita' });
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

const obtenerCitas = async (req, res) => {
    try {
        const where = {};
        
        // Si es paciente, solo ve sus citas
        if (req.user.rol === 'paciente') {
            where.pacienteId = req.user.id;
        }

        const citas = await Cita.findAll({
            where,
            include: [
                { model: Paciente, attributes: ['nombre', 'email'] }
            ],
            order: [['fecha', 'ASC']]
        });

        res.json(citas);
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al obtener las citas' });
    }
};

export {
    crearCita,
    actualizarCita,
    eliminarCita,
    obtenerCitas
}; 
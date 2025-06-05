import { Paciente } from '../models/Paciente.js';
import { Usuario } from '../models/Usuario.js';

const crearPaciente = async (req, res) => {
    const { nombre, email, telefono, fechaNacimiento } = req.body;

    try {
        // Verificar si ya existe un paciente con ese email
        const pacienteExiste = await Paciente.findOne({ where: { email } });
        if (pacienteExiste) {
            return res.status(400).json({ mensaje: 'Ya existe un paciente con ese email' });
        }

        // Crear el paciente
        const paciente = await Paciente.create({
            nombre,
            email,
            telefono,
            fechaNacimiento
        });

        res.json({
            mensaje: 'Paciente creado correctamente',
            paciente
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al crear el paciente' });
    }
};

const actualizarPaciente = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono, fechaNacimiento } = req.body;

    try {
        const paciente = await Paciente.findByPk(id);
        if (!paciente) {
            return res.status(404).json({ mensaje: 'Paciente no encontrado' });
        }

        // Verificar si el nuevo email ya está en uso por otro paciente
        if (email !== paciente.email) {
            const emailExiste = await Paciente.findOne({ where: { email } });
            if (emailExiste) {
                return res.status(400).json({ mensaje: 'El email ya está en uso' });
            }
        }

        // Actualizar el paciente
        await paciente.update({
            nombre: nombre || paciente.nombre,
            email: email || paciente.email,
            telefono: telefono || paciente.telefono,
            fechaNacimiento: fechaNacimiento || paciente.fechaNacimiento
        });

        res.json({
            mensaje: 'Paciente actualizado correctamente',
            paciente
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al actualizar el paciente' });
    }
};

const eliminarPaciente = async (req, res) => {
    const { id } = req.params;

    try {
        const paciente = await Paciente.findByPk(id);
        if (!paciente) {
            return res.status(404).json({ mensaje: 'Paciente no encontrado' });
        }

        // Eliminar el paciente
        await paciente.destroy();

        res.json({ mensaje: 'Paciente eliminado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al eliminar el paciente' });
    }
};

const obtenerPacientes = async (req, res) => {
    try {
        const pacientes = await Paciente.findAll({
            order: [['nombre', 'ASC']]
        });

        res.json(pacientes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al obtener los pacientes' });
    }
};

export {
    crearPaciente,
    actualizarPaciente,
    eliminarPaciente,
    obtenerPacientes
}; 
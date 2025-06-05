import Servicio from '../models/Servicio.js';

const SERVICIOS_DEFAULT = [
    {
        nombre_servicio: 'Limpieza Dental',
        descripcion: 'Mantén tu sonrisa brillante con nuestros tratamientos de limpieza profesional.',
        precio: 150000,
        duracion_minutos: 60,
    },
    {
        nombre_servicio: 'Ortodoncia',
        descripcion: 'Corrige la posición de tus dientes con nuestros tratamientos ortodónticos.',
        precio: 2500000,
        duracion_minutos: 90,
    },
    {
        nombre_servicio: 'Blanqueamiento Dental',
        descripcion: 'Obtén una sonrisa más brillante y radiante con nuestro tratamiento profesional.',
        precio: 300000,
        duracion_minutos: 120,
    }
];

const insertarServiciosDefault = async () => {
    try {
        for (const servicio of SERVICIOS_DEFAULT) {
            await Servicio.findOrCreate({
                where: { nombre_servicio: servicio.nombre_servicio },
                defaults: servicio
            });
        }
        console.log('Servicios por defecto insertados correctamente');
    } catch (error) {
        console.error('Error al insertar servicios por defecto:', error);
    }
};

const obtenerServicios = async (req, res) => {
    try {
        const servicios = await Servicio.findAll({
            order: [['servicio_id', 'ASC']]
        });
        res.json(servicios);
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al obtener los servicios' });
    }
};

const crearServicio = async (req, res) => {
    try {
        // Verificar si es uno de los servicios por defecto
        const esServicioDefault = SERVICIOS_DEFAULT.some(
            s => s.nombre_servicio.toLowerCase() === req.body.nombre_servicio.toLowerCase()
        );

        if (esServicioDefault) {
            return res.status(400).json({ 
                mensaje: 'No se pueden modificar los servicios principales' 
            });
        }

        const servicio = await Servicio.create(req.body);
        res.json(servicio);
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al crear el servicio' });
    }
};

const actualizarServicio = async (req, res) => {
    const { id } = req.params;
    try {
        const servicio = await Servicio.findByPk(id);
        if (!servicio) {
            return res.status(404).json({ mensaje: 'Servicio no encontrado' });
        }

        // Verificar si es uno de los servicios por defecto
        const esServicioDefault = SERVICIOS_DEFAULT.some(
            s => s.nombre_servicio.toLowerCase() === servicio.nombre_servicio.toLowerCase()
        );

        if (esServicioDefault) {
            return res.status(400).json({ 
                mensaje: 'No se pueden modificar los servicios principales' 
            });
        }

        await servicio.update(req.body);
        res.json(servicio);
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al actualizar el servicio' });
    }
};

const eliminarServicio = async (req, res) => {
    const { id } = req.params;
    try {
        const servicio = await Servicio.findByPk(id);
        if (!servicio) {
            return res.status(404).json({ mensaje: 'Servicio no encontrado' });
        }

        // Verificar si es uno de los servicios por defecto
        const esServicioDefault = SERVICIOS_DEFAULT.some(
            s => s.nombre_servicio.toLowerCase() === servicio.nombre_servicio.toLowerCase()
        );

        if (esServicioDefault) {
            return res.status(400).json({ 
                mensaje: 'No se pueden eliminar los servicios principales' 
            });
        }

        await servicio.destroy();
        res.json({ mensaje: 'Servicio eliminado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al eliminar el servicio' });
    }
};

export {
    insertarServiciosDefault,
    obtenerServicios,
    crearServicio,
    actualizarServicio,
    eliminarServicio
}; 
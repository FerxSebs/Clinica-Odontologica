import Cita from '../models/Cita.js';
import Paciente from '../models/Paciente.js';
import Personal from '../models/Personal.js';
import Testimonio from '../models/Testimonio.js';
import Servicio from '../models/Servicio.js';
import HistorialClinico from '../models/HistorialClinico.js';

// Servicios predefinidos - los movemos fuera para reutilizarlos
const serviciosPredefinidos = [
    {
        nombre_servicio: 'Limpieza Dental',
        descripcion: 'Mantén tu sonrisa brillante y saludable con nuestra limpieza dental profesional. Eliminamos la placa, el sarro y las manchas superficiales para una mejor salud bucal.',
        imagen: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&auto=format&fit=crop&q=80",
        icono: "fa-tooth",
        link: "limpieza",
        servicio_id: 1,
        precio: 50000,
        duracion_minutos: 60
    },
    {
        nombre_servicio: 'Ortodoncia',
        descripcion: 'Corrige la alineación de tus dientes con nuestros tratamientos de ortodoncia personalizados. Ofrecemos diferentes opciones para todas las edades.',
        imagen: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop&q=80",
        icono: "fa-teeth",
        link: "ortodoncia",
        servicio_id: 2,
        precio: 2500000,
        duracion_minutos: 90
    },
    {
        nombre_servicio: 'Blanqueamiento Dental',
        descripcion: 'Obtén una sonrisa más brillante con nuestro tratamiento de blanqueamiento dental profesional. Resultados notables desde la primera sesión.',
        imagen: "/img/blanqueamiento.png",
        icono: "fa-teeth",
        link: "blanqueamiento",
        servicio_id: 3,
        precio: 200000,
        duracion_minutos: 120
    },
    {
        nombre_servicio: 'Implantes Dentales',
        descripcion: 'Recupera tu sonrisa completa con nuestros implantes dentales de alta calidad. Una solución permanente y natural.',
        imagen: "https://arteoral.com/wp-content/uploads/2024/01/implantes-dentales.png",
        icono: "fa-tooth",
        link: "implantes",
        servicio_id: 4,
        precio: 1500000,
        duracion_minutos: 180
    },
    {
        nombre_servicio: 'Endodoncia',
        descripcion: 'Tratamiento especializado para salvar dientes dañados o infectados. Procedimiento indoloro con tecnología moderna.',
        imagen: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=500&auto=format&fit=crop&q=80",
        icono: "fa-tooth",
        link: "endodoncia",
        servicio_id: 5,
        precio: 400000,
        duracion_minutos: 90
    },
    {
        nombre_servicio: 'Periodoncia',
        descripcion: 'Tratamiento de enfermedades de las encías y tejidos que sostienen los dientes. Prevención y cura de la periodontitis.',
        imagen: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&auto=format&fit=crop&q=80",
        icono: "fa-tooth",
        link: "periodoncia",
        servicio_id: 6,
        precio: 300000,
        duracion_minutos: 60
    }
];

const paginaInicio = async (req, res) => {
    try {
        const testimonios = await Testimonio.findAll({
            include: {
                model: Paciente,
                as: 'paciente',
                attributes: ['nombre', 'apellido']
            },
            limit: 3,
            order: [['fecha', 'DESC']]
        });

        // Usar solo los primeros 3 servicios para la página de inicio
        const servicios = serviciosPredefinidos.slice(0, 3);

        res.render('inicio', {
            pagina: 'Inicio',
            testimonios,
            servicios
        });
    } catch (error) {
        console.log(error);
        res.render('inicio', {
            pagina: 'Inicio',
            error: 'Error al cargar la página',
            servicios: []
        });
    }
};

const paginaServicios = async (req, res) => {
    try {
        // Usar todos los servicios predefinidos
        res.render('servicios', {
            pagina: 'Servicios',
            servicios: serviciosPredefinidos
        });
    } catch (error) {
        console.log(error);
        res.render('servicios', {
            pagina: 'Servicios',
            error: 'Error al cargar los servicios',
            servicios: []
        });
    }
};

const paginaCitas = async (req, res) => {
    try {
        let citas;
        if (req.session.usuario.tipo === 'personal') {
            citas = await Cita.findAll({
                where: {
                    numero_identificacion_personal: req.session.usuario.numero_identificacion
                },
                include: [
                    {
                        model: Paciente,
                        attributes: ['nombre', 'apellido', 'telefono']
                    },
                    {
                        model: Servicio,
                        attributes: ['nombre_servicio']
                    }
                ],
                order: [['fecha_hora', 'ASC']]
            });
        } else {
            citas = await Cita.findAll({
                where: {
                    numero_identificacion_paciente: req.session.usuario.numero_identificacion
                },
                include: [
                    {
                        model: Personal,
                        attributes: ['nombre', 'apellido', 'especialidad']
                    },
                    {
                        model: Servicio,
                        attributes: ['nombre_servicio']
                    }
                ],
                order: [['fecha_hora', 'ASC']]
            });
        }

        res.render('citas', {
            pagina: 'Mis Citas',
            citas
        });
    } catch (error) {
        console.log(error);
        res.render('citas', {
            pagina: 'Mis Citas',
            error: 'Error al cargar las citas'
        });
    }
};

const paginaPacientes = async (req, res) => {
    try {
        const pacientes = await Paciente.findAll({
            attributes: ['numero_identificacion', 'nombre', 'apellido', 'email', 'telefono']
        });

        res.render('pacientes', {
            pagina: 'Pacientes',
            pacientes
        });
    } catch (error) {
        console.log(error);
        res.render('pacientes', {
            pagina: 'Pacientes',
            error: 'Error al cargar los pacientes'
        });
    }
};

const paginaHistorial = async (req, res) => {
    const { numero_identificacion } = req.params;

    try {
        const historial = await HistorialClinico.findAll({
            where: {
                numero_identificacion_paciente: numero_identificacion
            },
            include: [
                {
                    model: Paciente,
                    attributes: ['nombre', 'apellido']
                }
            ],
            order: [['fecha', 'DESC']]
        });

        const paciente = await Paciente.findByPk(numero_identificacion);

        res.render('historial', {
            pagina: `Historial de ${paciente.nombre} ${paciente.apellido}`,
            historial,
            paciente
        });
    } catch (error) {
        console.log(error);
        res.render('historial', {
            pagina: 'Historial',
            error: 'Error al cargar el historial'
        });
    }
};

export {
    paginaInicio,
    paginaServicios,
    paginaCitas,
    paginaPacientes,
    paginaHistorial
};
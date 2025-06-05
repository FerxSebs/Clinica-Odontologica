import Testimonio from '../models/Testimonio.js';
import Paciente from '../models/Paciente.js';

const guardarTestimonio = async (req, res) => {
    const { contenido } = req.body;
    const { numero_identificacion } = req.session.usuario;

    try {
        await Testimonio.create({
            contenido,
            numero_identificacion_paciente: numero_identificacion,
            fecha: new Date()
        });

        res.redirect('/testimonios');
    } catch (error) {
        console.log(error);
        const testimonios = await Testimonio.findAll({
            include: {
                model: Paciente,
                as: 'paciente',
                attributes: ['nombre', 'apellido']
            },
            order: [['fecha', 'DESC']]
        });

        res.render('testimonios', {
            pagina: 'Testimonios',
            error: 'Error al guardar el testimonio',
            testimonios
        });
    }
};

const mostrarTestimonios = async (req, res) => {
    try {
        const testimonios = await Testimonio.findAll({
            include: {
                model: Paciente,
                as: 'paciente',
                attributes: ['nombre', 'apellido']
            },
            order: [['fecha', 'DESC']]
        });

        res.render('testimonios', {
            pagina: 'Testimonios',
            testimonios
        });
    } catch (error) {
        console.log(error);
        res.render('testimonios', {
            pagina: 'Testimonios',
            error: 'Error al cargar los testimonios',
            testimonios: []
        });
    }
};

const adminTestimonios = async (req, res) => {
    try {
        const testimonios = await Testimonio.findAll({
            include: {
                model: Paciente,
                as: 'paciente',
                attributes: ['nombre', 'apellido', 'email']
            },
            order: [['fecha', 'DESC']]
        });

        res.render('admin/testimonios', {
            pagina: 'Administrar Testimonios',
            testimonios
        });
    } catch (error) {
        console.log(error);
        res.redirect('/admin');
    }
};

export {
    guardarTestimonio,
    mostrarTestimonios,
    adminTestimonios
}; 
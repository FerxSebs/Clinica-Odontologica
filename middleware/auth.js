const protegerRuta = (req, res, next) => {
    if (!req.session.usuario) {
        return res.redirect('/login');
    }
    next();
};

const verificarTipo = (tipos) => {
    return (req, res, next) => {
        if (!tipos.includes(req.session.usuario.tipo)) {
            return res.redirect('/');
        }
        next();
    };
};

const esPersonal = (req, res, next) => {
    if (req.session.usuario.tipo !== 'personal') {
        return res.redirect('/');
    }
    next();
};

const esPaciente = (req, res, next) => {
    if (req.session.usuario.tipo !== 'paciente') {
        return res.redirect('/');
    }
    next();
};

const esAdmin = (req, res, next) => {
    if (req.session.usuario.tipo !== 'personal' || req.session.usuario.especialidad !== 'admin') {
        return res.redirect('/');
    }
    next();
};

export {
    protegerRuta,
    verificarTipo,
    esPersonal,
    esPaciente,
    esAdmin
}; 
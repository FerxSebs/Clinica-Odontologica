import Paciente from './Paciente.js';
import Personal from './Personal.js';
import Servicio from './Servicio.js';
import Testimonio from './Testimonio.js';
import Cita from './Cita.js';
import HistorialClinico from './HistorialClinico.js';

// Relaciones Paciente-Testimonio
Paciente.hasMany(Testimonio, {
    foreignKey: 'numero_identificacion_paciente',
    as: 'testimonios'
});
Testimonio.belongsTo(Paciente, {
    foreignKey: 'numero_identificacion_paciente',
    as: 'paciente_testimonio'
});

// Relaciones Paciente-Cita
Paciente.hasMany(Cita, {
    foreignKey: 'numero_identificacion_paciente',
    as: 'citas'
});
Cita.belongsTo(Paciente, {
    foreignKey: 'numero_identificacion_paciente',
    as: 'paciente_cita'
});

// Relaciones Personal-Cita
Personal.hasMany(Cita, {
    foreignKey: 'numero_identificacion_personal',
    as: 'citas_atendidas'
});
Cita.belongsTo(Personal, {
    foreignKey: 'numero_identificacion_personal',
    as: 'personal_cita'
});

// Relaciones Servicio-Cita
Servicio.hasMany(Cita, {
    foreignKey: 'servicio_id',
    as: 'citas'
});
Cita.belongsTo(Servicio, {
    foreignKey: 'servicio_id',
    as: 'servicio'
});

// Relaciones Paciente-HistorialClinico
Paciente.hasMany(HistorialClinico, {
    foreignKey: 'numero_identificacion_paciente',
    as: 'historiales'
});
HistorialClinico.belongsTo(Paciente, {
    foreignKey: 'numero_identificacion_paciente',
    as: 'paciente_historial'
});

// Relaciones Personal-HistorialClinico
Personal.hasMany(HistorialClinico, {
    foreignKey: 'numero_identificacion_personal',
    as: 'historiales_atendidos'
});
HistorialClinico.belongsTo(Personal, {
    foreignKey: 'numero_identificacion_personal',
    as: 'personal_historial'
});

export {
    Paciente,
    Personal,
    Servicio,
    Testimonio,
    Cita,
    HistorialClinico
}; 
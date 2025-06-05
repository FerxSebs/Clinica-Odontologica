import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Paciente from './Paciente.js';

const HistorialClinico = db.define('Historial_Clinico', {
    historial_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero_identificacion_paciente: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
            model: Paciente,
            key: 'numero_identificacion'
        }
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    tratamiento: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

// Definir la relación
HistorialClinico.belongsTo(Paciente, { foreignKey: 'numero_identificacion_paciente' });

export default HistorialClinico; 
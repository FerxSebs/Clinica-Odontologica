import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Servicio = db.define('Servicios', {
    servicio_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_servicio: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    duracion_minutos: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'servicios'
});

export default Servicio; 
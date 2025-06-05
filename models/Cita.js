import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Paciente from './Paciente.js';
import Personal from './Personal.js';
import Servicio from './Servicio.js';

const Cita = db.define('Citas', {
    cita_id: {
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
    numero_identificacion_personal: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
            model: Personal,
            key: 'numero_identificacion'
        }
    },
    servicio_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Servicio,
            key: 'servicio_id'
        }
    },
    fecha_hora: {
        type: DataTypes.DATE,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada'),
        defaultValue: 'pendiente'
    }
}, {
    tableName: 'citas'
});

// Definir las relaciones
Cita.belongsTo(Paciente, { foreignKey: 'numero_identificacion_paciente' });
Cita.belongsTo(Personal, { foreignKey: 'numero_identificacion_personal' });
Cita.belongsTo(Servicio, { foreignKey: 'servicio_id' });

export default Cita; 
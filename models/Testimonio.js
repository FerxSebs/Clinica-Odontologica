import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Paciente from './Paciente.js';

const Testimonio = db.define('testimonios', {
    testimonio_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero_identificacion_paciente: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
            model: 'pacientes',
            key: 'numero_identificacion'
        }
    },
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'testimonios',
    timestamps: false,
    indexes: [
        {
            fields: ['numero_identificacion_paciente']
        }
    ]
});

// Configuración explícita de la llave foránea
Testimonio.options.indexes = [
    {
        name: 'fk_testimonio_paciente_unique',
        fields: ['numero_identificacion_paciente'],
        unique: false
    }
];

// Definir la relación con Paciente
Testimonio.belongsTo(Paciente, {
    foreignKey: 'numero_identificacion_paciente',
    as: 'paciente'
});

export default Testimonio; 
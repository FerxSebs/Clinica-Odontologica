import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Usuario from './Usuario.js';

const Testimonial = db.define('testimoniales', {
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El contenido del testimonio no puede estar vacío'
            }
        }
    },
    puntuacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: 1,
                msg: 'La puntuación mínima es 1'
            },
            max: {
                args: 5,
                msg: 'La puntuación máxima es 5'
            }
        }
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id'
        }
    }
});

// Un usuario puede tener muchos testimoniales
Usuario.hasMany(Testimonial, { foreignKey: 'usuarioId' });
// Un testimonial pertenece a un usuario
Testimonial.belongsTo(Usuario, { foreignKey: 'usuarioId' });

export default Testimonial;
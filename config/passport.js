import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { Usuario } from '../models/Usuario.js';

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const usuario = await Usuario.findOne({ where: { email } });
        
        if (!usuario) {
            return done(null, false, { message: 'El usuario no existe' });
        }

        const validPassword = await bcrypt.compare(password, usuario.password);
        
        if (!validPassword) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }

        return done(null, usuario);
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const usuario = await Usuario.findByPk(id);
        done(null, usuario);
    } catch (error) {
        done(error);
    }
});

export default passport; 
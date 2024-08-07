const conexion = require('../database/db');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const { nombre, correo_electronico, contrasena } = req.body;

    if (!nombre || !correo_electronico || !contrasena) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    try {
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        conexion.query('INSERT INTO usuarios SET ?', { nombre, correo_electronico, contrasena: hashedPassword, rol: 'normal' }, (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: 'Error al registrar usuario' });
            }
            res.json({ message: 'Usuario registrado exitosamente' });
            console.log('nuevo usuario registrado');
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

exports.login = (req, res) => {
    const { correo_electronico, contrasena } = req.body;

    conexion.query('SELECT * FROM usuarios WHERE correo_electronico = ?', [correo_electronico], async (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        if (results.length === 0) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        const user = results[0];
        const validPassword = await bcrypt.compare(contrasena, user.contrasena);

        if (!validPassword) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        req.session.userId = user.id;
        req.session.userRole = user.rol;
        req.session.user = {
            id: user.id,
            nombre: user.nombre,
            correo_electronico: user.correo_electronico,
            rol: user.rol
        };

        const redirectUrl = user.rol === 'admin' ? '/admin' : '/extra';
        res.json({ 
            message: 'Inicio de sesión exitoso',
            redirect: redirectUrl
        });
        console.log('Inicio de sesión exitoso. Redirigiendo a:', redirectUrl);
    });
}


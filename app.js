const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const path = require('path');
const { conexion } = require('./database/db');
const session = require('express-session');

// Configuración de la sesión
app.use(session({
    secret: 'tu_secreto_aqui',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Configuración de la vista y el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));
app.use(express.json())

// Middleware para añadir información del usuario a todas las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use('/', require('./router'));

// Ruta para registrar un nuevo usuario
app.post('/register', async (req, res) => {
    const { nombre, correo_electronico, contrasena } = req.body;

    if (!nombre || !correo_electronico || !contrasena) {
        return res.status(400).send('Faltan campos');
    }

    try {
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        const query = 'INSERT INTO usuarios (nombre, correo_electronico, contrasena, rol) VALUES (?, ?, ?, ?)';
        conexion.query(query, [nombre, correo_electronico, hashedPassword, 'normal'], (err, result) => {
            if (err) throw err;
            res.send('Usuario registrado exitosamente');
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
    const { correo_electronico, contrasena } = req.body;
    console.log('Intento de inicio de sesión para:', correo_electronico);

    const query = 'SELECT * FROM usuarios WHERE correo_electronico = ?';
    conexion.query(query, [correo_electronico], async (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).send('Error en el servidor');
        }
        
        console.log('Resultados de la consulta:', results);
        
        if (results.length === 0) {
            console.log('Usuario no encontrado:', correo_electronico);
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }
        
        const user = results[0];
        console.log('Usuario encontrado:', user.nombre);
        
        const validPassword = await bcrypt.compare(contrasena, user.contrasena);
        console.log('¿Contraseña válida?', validPassword);

        if (!validPassword) {
            console.log('Contraseña incorrecta para:', correo_electronico);
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
        
        console.log('Inicio de sesión exitoso. Rol:', user.rol);
        
        // Redirigir según el rol del usuario
        if (user.rol === 'admin') {
            console.log('Redirigiendo a /admin');
            return res.redirect('/admin');
        } else {
            console.log('Redirigiendo a /extra');
            return res.redirect('/extra');
        }
    });
});

// Ruta para la página principal
app.get('/', (req, res) => {
    res.render('index');
});

// Ruta para páginas dinámicas
app.get('/:page', (req, res) => {
    const page = req.params.page;
    const validPages = ['caracteristicas', 'extra', 'admin', 'tarjeta1', 'tarjeta2', 'tarjeta3', 'tarjeta4', 'cambiarclave', 'about'];
    
    if (validPages.includes(page)) {
        res.render(page);
    } else {
        res.status(404).send('Página no encontrada');
    }
});

// Iniciar el servidor en el puerto 4000
app.listen(4000, function () {
    console.log('http://localhost:4000');
});
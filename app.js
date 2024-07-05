const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { conexiondb } = require('./conexion'); // Importar conexión a la base de datos

const app = express();

// Configuración del motor de vistas y carpeta de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware para servir archivos estáticos
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para la página principal
app.get('/', (req, res) => {
    res.render('index'); // Renderiza el archivo index.ejs
});

// Ruta dinámica para múltiples páginas
app.get('/:page', (req, res) => {
    const page = req.params.page;
    const validPages = ['caracteristicas', 'home', 'admin', 'contact', 'tarjeta1', 'tarjeta2', 'tarjeta3', 'tarjeta4', 'cambiarclave', 'about'];
    
    if (validPages.includes(page)) {
        res.render(page);
    } else {
        res.status(404).send('Página no encontrada');
    }
});

app.listen(4000, function () {
    console.log('http://localhost:4000');
});


const mysql = require('mysql');
const conexiondb = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'dbcopiasiembra'
});
conexiondb.connect(function(err) {
    if (err) {
        throw err;
    } else {
        console.log('Conexion exitosa');
    }
});
module.exports = {conexiondb};
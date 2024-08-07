const conexion = require('../database/db')

exports.save = (req, res) => {
    const nombre_sector = req.body.nombre_sector;
    const hectareas = req.body.hectareas;
  
    conexion.query('INSERT INTO predios SET ?', { nombre_sector: nombre_sector, hectareas: hectareas }, (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect('/admin');
        }
    });
}

exports.update = (req, res)=>{
    const id_predio = req.body.id_predio;
    const nombre_sector = req.body.nombre_sector;
    const hectareas = req.body.hectareas;
    conexion.query('UPDATE predios SET ? WHERE id_predio = ?', [{hectareas:hectareas ,nombre_sector:nombre_sector}, id_predio], (error, results)=>{
        if (error) {
            console.log(error);
        } else {
            res.redirect('/admin');
        }
    })
}
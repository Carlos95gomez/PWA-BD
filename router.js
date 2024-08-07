const express = require('express');
const router = express.Router();
const conexion = require('./database/db');
const authController = require('./controllers/authController');


//mostrar predios
router.get('/admin', (req, res)=>{
   
    conexion.query('select * from predios', (error, results)=>{
        if (error) {
            throw error;
        } else{
            res.render('admin', {results:results});
            
        }
   }) 
})

//agregar predios
router.get('/create', (req, res)=>{
    res.render('create');
})

//EDITAR PREDIOS
router.get('/edit/:id_predio', (req, res)=>{
    const id_predio = req.params.id_predio;
    conexion.query('SELECT * FROM predios WHERE id_predio=?', [id_predio], (error, results)=>{
        if (error) {
            throw error;
        } else{
            res.render('edit', {predio: results[0]});
        }
    })
})
//ruta eliminar predio
router.get('/delete/:id_predio', (req, res)=>{
    const id_predio= req.params.id_predio;
    conexion.query('DELETE FROM predios WHERE id_predio = ?', [id_predio], (error, results)=>{
        if (error) {
            throw error;
        } else{
            res.redirect('/admin');
        }
    })
})


const crud = require('./controllers/crud');
router.post('/save', crud.save);
router.post('/update', crud.update);
router.post('/register', authController.register);
router.post('/login', authController.login);


module.exports = router;
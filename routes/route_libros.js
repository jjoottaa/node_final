const express= require('express');
const router = express.Router();

const c_libros = require('../controllers/c_crud_libros');

router.get('/valida', c_libros.valida); 
router.get('/modifica', c_libros.modifica); 
router.get('/reload', c_libros.reload);  
router.get('/delete/:id/:titulo', c_libros.delete); 
router.get('/update/:id/:titulo', c_libros.update);
router.get('/carga_ingresa_libro', c_libros.carga_ingresa_libro);
router.get('/log/:id', c_libros.login);
router.get('/salir', c_libros.salir);


module.exports= router;


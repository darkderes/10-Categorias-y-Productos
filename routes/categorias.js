const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT,validarCampos } = require('../middlewares');
const { crearCategoria,obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

// Obtener todas las categorias - public
router.get('/',obtenerCategorias);
// Obtener una categoria - public
router.get('/:id',[check('id','No es un id de Mongo váliado').isMongoId()],validarCampos,obtenerCategoria
,check('id').custom( existeCategoriaPorId ));
// crear categoria private
router.post('/',[validarJWT],
check('nombre','elnombre es obligatorio').not().isEmpty(),
validarCampos
,crearCategoria);
//Actualizar categoria private
router.put('/:id',[validarJWT],
check('nombre','El nombre es obligatorio').not().isEmpty(),
check('id').custom( existeCategoriaPorId),
validarCampos,
actualizarCategoria);
//Eliminar categoria private - ADMIN
router.delete('/:id',validarJWT,esAdminRole
,check('id').custom(existeCategoriaPorId),
validarCampos
,borrarCategoria);




module.exports = router;
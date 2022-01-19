const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT,validarCampos } = require('../middlewares');
const { crearProducto,obtenerProductos, obtenerProducto, actualizarProducto, borrarProductos } = require('../controllers/productos');
const { existeProductoPorId,existeCategoriaPorId } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

// Obtener todas las categorias - public
router.get('/',obtenerProductos);
// Obtener una categoria - public
router.get('/:id',[check('id','No es un id de Mongo váliado').isMongoId()],validarCampos
,check('id').custom( existeProductoPorId ),obtenerProducto);

// crear categoria private
router.post('/',[validarJWT],
check('nombre','elnombre es obligatorio').not().isEmpty(),
// check('categoria','no es un Id de mongo').isMongoId(),
// check('categoria').custom(existeCategoriaPorId),
validarCampos
,crearProducto);

// //Actualizar categoria private
 router.put('/:id',
  [validarJWT,
   check('id').custom( existeProductoPorId),
  check('categoria','no es un Id de mongo').isMongoId(),
  validarCampos]
  ,actualizarProducto);
 


// //Eliminar categoria private - ADMIN
// router.delete('/:id',validarJWT,esAdminRole
// ,check('id').custom(existeProductoPorId),
//  validarCampos
// ,borrarProductos);




module.exports = router;
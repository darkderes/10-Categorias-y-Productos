const { response } = require("express");
const {Producto} = require('../models'); 

//OBTENER ProductoS -PAGINADO - TOTAL -populate
const obtenerProductos = async(req,res = response) => {

    const { limite = 5,desde = 0} = req.query;
    const query = { estado : true};
  
    const [total,producto] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        producto
    });
}


//OBTENER ProductoS -populate
const obtenerProducto = async(req,res = response) => {
    const { id } = req.params;
    const producto = await Producto.findById( id );
    res.json(producto);
}

//actualizar Producto
const actualizarProducto = async(req,res = response) => {
    const { id } = req.params;
    const { estado,...data }  =req.body;
    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
    const producto = await  Producto.findByIdAndUpdate(id,data,{new:true});
    res.json(producto);
}


//borrarProducto

const borrarProducto = async(req,res = response) => {
    const { id } = req.params;
   
    const producto = await  Producto.findByIdAndUpdate(id, { estado:false},{new: true});
    res.json(producto);
}

const crearProducto = async (req,res=response) => {

    const {estado,usuario,...body} = req.body;

    const productoDb = await Producto.findOne({ nombre: body.nombre });

    if (productoDb){
        return res.status(400).json({
            msg: 'La Producto ya existe'
        });

    }
    //Geberar la data a guardar

    const data = {
        ...body,
        nombre:body.nombre.toUpperCase()
     //   ,usuario: req.usuario._id
    }

    const producto = new Producto(data);

    // guardra db

    await producto.save();
    
    res.status(201).json(producto);
}
module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}
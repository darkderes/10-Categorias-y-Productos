const { response } = require("express");
const { Categoria} = require('../models'); 

//OBTENER CATEGORIAS -PAGINADO - TOTAL -populate
const obtenerCategorias = async(req,res = response) => {

    const { limite = 5,desde = 0} = req.query;
    const query = { estado : true};
  
    const [total,categoria] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        categoria
    });
}


//OBTENER CATEGORIAS -populate
const obtenerCategoria = async(req,res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById( id );
    res.json(categoria);
}

//actualizar categoria
const actualizarCategoria = async(req,res = response) => {
    const { id } = req.params;
    const { estado,...data }  =req.body;
    data.nombre = data.nombre.toUpperCase();
    const categoria = await  Categoria.findByIdAndUpdate(id,data,{new:true});
    res.json(categoria);
}


//borrarCategoria

const borrarCategoria = async(req,res = response) => {
    const { id } = req.params;
   
    const categoria = await  Categoria.findByIdAndUpdate(id, { estado:false},{new: true});
    res.json(categoria);
}

const crearCategoria = async (req,res=response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDb = await Categoria.findOne({ nombre });

    if (categoriaDb){
        return res.status(400).json({
            msg: 'La categoria ya existe'
        });

    }
    //Geberar la data a guardar

    const data = {
        nombre
     //   ,usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    // guardra db

    await categoria.save();
    
    res.status(201).json(categoria);
}
module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}
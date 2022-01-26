const { response } = require("express");
const  path  = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDDINARY_URL)


const { Model, model } = require("mongoose");
const { subirArchivo } = require('../helpers');
const {Usuario,Producto} = require('../models');
const producto = require("../models/producto");

const cargarArchivo = async(req,res = response) => {

try 
{
  const nombre = await subirArchivo (req.files,['txt','md'],'texto');
  res.json({ nombre});
} catch (error) {
  res.status(400).json({error});
}        
}
const actualizarImagen = async(req,res = response) => {


  const {id,coleccion} = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg: 'No existe ID'
        });
      }
      break;

      case 'productos':
      modelo = await Producto.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg: 'No existe producto ID'
        });
      }
      break;
  
    default:
        return res.status(500).json({msg: 'se me olvido validar esto'});
  }
//limpiarImagenes previas

 if (modelo.img){
     const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.img);
     if(fs.existsSync(pathImagen)){
       fs.unlinkSync(pathImagen);
     }
 }


  const nombre = await subirArchivo (req.files,undefined,coleccion);
  modelo.img = await nombre;
  await modelo.save();

  res.json(modelo);

}

const actualizarImagenCloudinary = async(req,res = response) => {


  const {id,coleccion} = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg: 'No existe ID'
        });
      }
      break;

      case 'productos':
      modelo = await Producto.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg: 'No existe producto ID'
        });
      }
      break;
  
    default:
        return res.status(500).json({msg: 'se me olvido validar esto'});
  }
//limpiarImagenes previas

 if (modelo.img){

  const nombreArr = modelo.img.split('/');
  const nombre = nombreArr[nombreArr.lenght -1];
  const [public_id] = nombre.split('.');
  cloudinary.uploader.destroy(public_id);

 }

 const { tempFilePath} = req.files.archivo

 const { secure_url } = cloudinary.uploader.upload(tempFilePath);

 modelo.img = secure_url;

 await modelo.save();

  res.json(modelo);

}

const mostrarImagen = async(req,res= response) => {

  const {id,coleccion} = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg: 'No existe ID'
        });
      }
      break;

      case 'productos':
      modelo = await Producto.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg: 'No existe producto ID'
        });
      }
      break;
  
    default:
        return res.status(500).json({msg: 'se me olvido validar esto'});
  }
//limpiarImagenes previas

 if (modelo.img){
     const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.img);
     if(fs.existsSync(pathImagen)){
        return res.sendFile(pathImagen)
     }
 }
 const pathImagen = path.join(__dirname,'../assets/no-image.jpg');
 res.sendFile(pathImagen);
}

module.exports = {
    cargarArchivo,actualizarImagen,mostrarImagen,actualizarImagenCloudinary
}
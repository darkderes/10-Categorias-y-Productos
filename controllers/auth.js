const bcryptjs = require('bcryptjs');
const { response } = require('express');
const Usuario = require('../models/usuario');
const { generarJWT} = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const { json } = require('express/lib/response');

const login = async(req,res = response) => {

    const { correo,password } = req.body;

    try {
            const usuario = await Usuario.findOne({correo});
            // valida usuario
            if(!usuario){
                return res.status(400).json({
                    msg:'Usuario / Password no son correctos - correos'
                });
            }
            // valida que usuario este activado
            if(!usuario.estado){
                return res.status(400).json({
                    msg:'Usuario / Password no son correctos - estado : false'
                });
            }
            // valida password
            const validPassword = bcryptjs.compareSync(password, usuario.password);
            if(!validPassword) {
                return res.status(400).json({
                    msg:'Usuario / Password no son correctos - passsword'
                });  
            }           
            const token = await generarJWT(usuario.id); 
                
                   
            res.json({
                usuario,token
            })
        //generar el JWTOKEN

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg:'Hable con el administrador'
        });        
    }
}

const googleSingIn = async(req,res = response) => {

    const  { id_token }  = req.body;
    try {  
        
        const {correo,nombre,img} = await googleVerify( id_token );
        
        let usuario = await Usuario.findOne({ correo });

        if(!usuario)
        {
            const data = {
                nombre,
                correo,
                password: '',
                img,
                google: true
            };
             usuario = new Usuario(data);
             await usuario.save();
        }
        if(! usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador,Usuario Bloqueado'
            });

        }
        // generar el JWT
        const token = await generarJWT(usuario.id); 

        res.json (
        {
          usuario,token
        }
    )
        
    } catch (error) {
        
        json.status(400).json({
            ok:false,
            msg: 'El Token no se pudo verificar'
        })
    }

 
}

module.exports = {
    login,
    googleSingIn
}
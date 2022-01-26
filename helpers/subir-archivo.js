const { v4: uuidv4 } = require('uuid');
const path = require('path');

const subirArchivo =( files, extensionesValidas = ['png','jpg','jpeg','gif'],carpeta = '') => {


    return new Promise ((resolve,reject) => {

    const { archivo } = files;
    const nombreCorto = archivo.name.split('.');
    const externsion = nombreCorto[nombreCorto.length -1];

    if(!extensionesValidas.includes(externsion)){
        return reject('La extension no es valida');
    }

    const nombreTemp = uuidv4() + '.' + externsion;
    const uploadPath = path.join ( __dirname,'../uploads/',carpeta,nombreTemp);
     // Use the mv() method to place the file somewhere on your server
     archivo.mv(uploadPath, (err) => {
       if (err){
         reject(err);
       }
       resolve(nombreTemp);
     });

    });


  

}

module.exports = {
    subirArchivo
}
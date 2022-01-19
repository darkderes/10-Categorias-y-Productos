const { Schema,model } = require ('mongoose');
const { Categoria } = require('.');

const CategoriaSchema = Schema({
    nombre :{
        type: String,
        require:[true,'La categoria es obligatoria'],
        unique:true
    },
    estado: {
        type:Boolean,
        default: true,
        required:true
    }
    
}); 

CategoriaSchema.methods.toJSON = function(){
    const {__V,estado,...data} = this.toObject();
    return data; 
}
module.exports= model('Categoria',CategoriaSchema);
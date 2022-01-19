const { Schema,model } = require ('mongoose');

const ProductoSchema = Schema({
    nombre :{
        type: String,
        require:[true,'el producto es obligatoria'],
        unique:true
    },
    estado: {
        type:Boolean,
        default: true,
        required:true
    },
    precio: {
        type:Number,
        default : 0
    },
    // categoria: {
    //     type:Schema.Types.ObjectId,
    //     ref: 'Categoria',
    //     required:true
    // },
    descripcion : {type : String},

    disponible : {type: Boolean,default:true}
   
}); 

ProductoSchema.methods.toJSON = function(){
    const {__V,estado,...data} = this.toObject();
    return data; 
}
module.exports= model('Producto',ProductoSchema);
import mongoose from 'mongoose';

const ProductSchema= mongoose.Schema(
    {
        productId:{
            type:String,
            required:true,
            unique:true
        },
        name:{
            type:String,
            required:true
        },
        alternativeNames:[
            {
                type:String,
                required:false
            }
        ],
        description:{
            type:String,
            required:true
        },
        images:[
            {
                type:String,
                required:false
            }
        ],
        labeledPrice:{
            type:Number,
            required:true
        },
        normalPrice:{
            type:Number,
            required:true
        },
        stock:{
            type:Number,
            required:false
        },
        isAvailable:{
            type:Boolean,
            required:true,
            default:true
        }
    }
)

const Product = mongoose.model('Products',ProductSchema)
export default Product;
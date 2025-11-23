import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    firstName:{
        type: String,
        required:true
    },
    lastName:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:false
    },
    phone:{
        type:String,
        required:false
    },
    role:{
        type:String,
        requires:true,
        default:"customer"
    },
    isBlocked:{
        type:Boolean,
        required:true,
        default:false
    },
    profileimage:{
        type:String,
        required:false,
        default:"https://mxlpkdrudnaffxfgykil.supabase.co/storage/v1/object/public/images/icon.png"
    },
    date:{
        type:Date,
        default:Date.now
    }
    
})

const User= mongoose.model('Users',UserSchema);
export default User;
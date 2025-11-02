import mongoose from 'mongoose';

const OTPschema = mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:Number,
        required:true
    }

});

const OTP= mongoose.model('OTP',OTPschema)
export default OTP;
import mongoose from 'mongoose';

export const connectDB = async ()=>{
    try{
        console.log("connecting to MongoDB");
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("connected to MongoDB");
    }
    catch(error){
        console.log(error);
    }
}

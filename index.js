import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import {connectDB}  from './config/db.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import OrderRouter from './routes/orderRoute.js';
import jwt from 'jsonwebtoken';

const app = express();

app.use(bodyParser.json());

app.use((req,res,next)=>{
    const tokenString= req.header("Authorization")
    if(tokenString)
    {
        const token= tokenString.replace('Bearer ',"")
        console.log(token)

        jwt.verify(token,"capital@123",
            (err,decoded)=>{
                if(decoded!==null){
                    console.log(decoded)
                    req.user=decoded
                    next()
                }else{
                    res.status(403).json({message:"Invalid token"})
                }
            }
        )
    }else{
        next();
    }
})

app.use('/users',userRouter);
app.use('/products',productRouter);
app.use('/orders',OrderRouter);

connectDB(); 

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});
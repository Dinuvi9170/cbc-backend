import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import {connectDB}  from './config/db.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import OrderRouter from './routes/orderRoute.js';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import Reviewrouter from './routes/reviewRoute.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use((req,res,next)=>{
    const tokenString= req.header("Authorization")
    if(tokenString)
    {
        const token= tokenString.replace('Bearer ',"")
        console.log(token)

        jwt.verify(token,process.env.JWT_SECRET,
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

app.use('/api/users',userRouter);
app.use('/api/products',productRouter);
app.use('/api/orders',OrderRouter);
app.use('/api/reviews',Reviewrouter);

connectDB(); 

app.listen(5000,()=>{
    console.log("Server is running on port 5000");
});
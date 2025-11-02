import axios from "axios";
import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import OTP from "../models/otp.js";

export const createUser = (req, res) => {
    if(req.role=="Admin"){
        if(req.user==null){
            res.status(403).json({message:"Please login first"})
            return;
        }else{
            if(req.user.role!=="Admin"){
                res.status(403).json({message:"You are not authorized to create admin accounts."});
                return;
            }
        }
    }

    const hashedPassword= bcrypt.hashSync(req.body.password,10);

    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
        profileimage: req.body.profileimage,
    });
    user.save()
    .then(() => {
        res.status(200).json({ message: "User created successfully" });
    })
    .catch((error) => {
        res.status(500).json({ message: "Failed to create user" });
        console.log(error);
    });
};

export const loginUser= (req,res)=>{
    const email=req.body.email;
    const password= req.body.password;

    User.findOne({email:email}).then(
        (user)=>{
            if(user==null)
                res.status(404).json({message:"User not found"})
            else
             {
                const isPasswordCorrect= bcrypt.compareSync(password,user.password)
                if(isPasswordCorrect)
                {
                    const token= jwt.sign({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        role:user.role,
                        profileimage:user.profileimage
                    },process.env.JWT_SECRET)
                    res.status(200).json({message:"Login successful",token:token,role:user.role})
                }
                else{
                    res.status(401).json({message:"Invalid password"})
                }
             }
        }
    )
};

export const loginWithGoogle = async (req,res)=>{
    const token= req.body.accessToken;
    if(!token){
        res.status(400).json({message:"Access token is required"})
        return;
    }
    try{const response= await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",{
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    console.log(response.data)
    const user= await User.findOne({
        email:response.data.email
    })
    if(!user){
        const user = await User.create({
            firstName: response.data.given_name,
            lastName: response.data.family_name,
            email: response.data.email,
            password: "googleUser",
            role: "customer",
            profileimage: response.data.picture,
        })
        const token=jwt.sign({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role:user.role,
            profileimage:user.profileimage
        },process.env.JWT_SECRET)
        res.status(200).json({message:"Google login successful",token:token,role:user.role})
    }else{
        const token= jwt.sign({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role:user.role,
                profileimage:user.profileimage
            },process.env.JWT_SECRET)
            res.status(200).json({message:"Login successful",token:token,role:user.role})

    }}catch(error){
        res.status(500).json({ message: "Failed google login" });
        console.log(error);
    }

}

const transporter=nodemailer.createTransport({
    service:'gmail',
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: "dinuvi2001@gmail.com",
        pass: process.env.App_pwd,
  },
})

export const sendOTP =async (req,res)=>{
    const randomOTP=Math.floor(100000+ Math.random()*900000);
    const email=req.body.email;
    if(!email){
        res.status(400).json({message:"Email is required"})
        return;
    }
    const user= await User.findOne({email:email});
    if(user==null){
        res.status(404).json({message:"User not found"})
        return;
    }
    await OTP.deleteMany({email:email})
    const message={
        from:"dinuv2001@gmail.com",
        to:email,
        subject: "Reset Password - Beauty Cosmetics",
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 400px; margin: auto;">
            <h2 style="color: #2C3E50;">Password Reset Request</h2>
            <p style="font-size: 16px; color: #333;">This is your email password reset OTP:</p>
            <h1 style="color: #1ABC9C; font-size: 36px; letter-spacing: 4px; margin: 10px 0;">${randomOTP}</h1>
            <p style="font-size: 14px; color: #555;">Please use this code to reset your password. It will expire soon.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #aaa;">Beauty Cosmetics © 2025</p>
            </div>
        `
    }
    await OTP.create({
        email:email,
        otp:randomOTP
    })

    transporter.sendMail(message,(error,info)=>{
        if(error){
            res.status(400).json({message:"Failed to send OTP",error:error})
        }else{
            res.status(200).json({message:"OTP sent successfully"})
        }
    })
}

export const ResetPassword=async(req,res)=>{
    try{
        const email= req.body.email;
        const newPassword =req.body.newpassword;
        
        const otp=await OTP.findOne({email:email});
        if(!otp){
            res.status(400).json({message:"No OTP found"})
            return;
        }
        
        if(req.body.otp==otp.otp){
            await OTP.deleteMany({email:email});
            const hashedPassword= bcrypt.hashSync(newPassword,10);
            const user= await User.findOneAndUpdate({email:email},{password:hashedPassword});
            if(!user){
                res.status(404).json({message:"User not found"})
                return;
            }
            res.status(200).json({message:"Changed the password sucessfully"})
        }else{
            res.status(403).json({message:"Invalid OTP"})
        }
    }catch(error){
        res.status(500).json({message:"Failed to reset the password"})
    }
}

export const isAdmin =(req)=>{
    if(req.user==null){
        return false;
    }
    if(req.user.role!=="Admin"){
        return false;
    }
    return true;
};

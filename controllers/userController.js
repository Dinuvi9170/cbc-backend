import axios from "axios";
import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

export const isAdmin =(req)=>{
    if(req.user==null){
        return false;
    }
    if(req.user.role!=="Admin"){
        return false;
    }
    return true;
};

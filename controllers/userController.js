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

export const isAdmin =(req)=>{
    if(req.user==null){
        return false;
    }
    if(req.user.role!=="Admin"){
        return false;
    }
    return true;
};

import Order from "../models/order.js";
import Product from "../models/product.js";

export const createOrder= async (req,res)=>{
    if(req.user==null){
        res.status(403).json({message:'Please login and try again'});
        return;
    }

    const orderInfo= req.body;
    if(orderInfo.name==null){
        orderInfo.name=req.user.firstName+" "+req.user.lastName;
    }   

    let orderId="CBC000001";

    const lastOrder= await Order.find().sort({date:-1}).limit(1);

    if(lastOrder.length>0){
        const lastOrderId= lastOrder[0].orderId
        const lastOrderString= parseInt(lastOrderId.replace('CBC',""))

        const newOrderNumber= lastOrderString+1;
        const newOrderString= String(newOrderNumber).padStart(5,'0');
        orderId="CBC"+newOrderString
    }

    let total=0;
    let labelTotal=0;
    const products=[];

    for(let i=0;i<orderInfo.products.length;i++){
        const item= await Product.findOne({ productId:orderInfo.products[i].productId});

        if(item==null){
            res.status(404).json({message: "productId "+orderInfo.products[i].productId +" Not found"});
            return;
        }
        if(item.isAvailable==false){
            res.status(404).json({message: "productId "+orderInfo.products[i].productId +" Not found"});
            return;
        }
        products[i]={
            productInfo:{
                productId:item.productId,
                name:item.name,
                alternativeNames:item.alternativeNames,
                description:item.description,
                labeledPrice:item.labeledPrice,
                normalPrice:item.normalPrice,
                images:item.images   
            },
            quantity:orderInfo.products[i].quantity
        }
        total+=item.normalPrice*orderInfo.products[i].quantity;
        labelTotal +=item.labeledPrice*orderInfo.products[i].quantity;
    }

    const order = new Order({
        orderId: orderId,
        email:req.user.email,
        name:orderInfo.name,
        address:orderInfo.address,
        phone:orderInfo.phone,
        total:total,
        labelTotal:labelTotal,
        products:products
    })

    try{
        const createdOrder= await order.save();
        res.status(200).json({message:"Order created successfully",order:createdOrder})
    }catch(error){
        res.status(500).json({message:"Failed to create order",error:error})
    }
};

export const GetOrder= async(req,res)=>{
    if(req.user===null){
        res.status(401).json({message:"Please login first and try again"})
        return 
    }
    try{
        if(req.user.role=="Admin"){
            const orders= await Order.find()
            res.status(200).json(orders)
        }else{
            const orders=await Order.find({email:req.user.email})
            res.status(200).json(orders)
        }
    }catch(error){
        res.status(500).json({message:"Failed to get order",error:error})
    }
}

export const GetOrderbyId = async(req,res)=>{
    const orderId=req.params.orderId;
    
    if(!req.user){
        res.status(401).json({message:"Please login first and try again"})
        return;
    }
    try{
        const order= await Order.findOne({orderId:orderId});
        if(!order){
            res.status(404).json({message:"Order not found"})
            return;
        }
        res.status(200).json(order)
        
    }catch(error){
        res.status(500).json({message:"Failed to get order",error:error})
    }
}

export const updateStatus =async (req,res)=>{
    if(req.user==null || req.user.role!="Admin"){
        res.status(403).json({message:"You are not authorized to change the order status."})
        return
    }
    try{
        const orderId=req.params.orderId;
        const {status}=req.body;
        const order= await Order.findOneAndUpdate(
            {orderId},
            {status},
            { new: true }
        )
        if(!order){
            res.status(404).json({message:"Order not found"})
            return;
        }
        res.status(200).json({message:"Status updated successfully",order})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"Failed to update order status",error:error})
    }
    
    

}
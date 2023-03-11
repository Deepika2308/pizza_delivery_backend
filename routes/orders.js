import express from 'express';
import Razorpay from 'razorpay';
import shortid from 'shortid';
import {saveOrder,
    getOrderHistory} from '../helper.js';
import crypto from 'crypto';

const router = express.Router();

//order/createOrder api - razorpay
router.post('/createOrder', async(req,res) => {
    try{
        const {totalPrice} = req.body;

        const instance = new Razorpay(
            {
                key_id:process.env.KEY_ID,
                key_secret:process.env.KEY_SECRET,
            }
        )

        const options = {
            amount:totalPrice,
            currency:"INR",
            receipt:shortid.generate(),
        }

        instance.orders.create(options,(err,order) => {
            if(err){
                return res.status(400).json({data:"Error in creating order"});
            }
            res.status(200).json({data:order});
        })
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"});
    }
})

//save order api
router.post('/saveOrder', async(req,res) => {
    try{
        const order = req.body;
       
        let result = await saveOrder(order);
        if(result){
            res.status(200).json({message:"Order saved"});
        }
        else{
            res.status(400).json({message:"Error in saving order"});
        }
    }
    catch(err){
        res.status(500).json({data:"Internal server error. Error is saving order in database"});
    }
})


//get order history

router.post('/getOrderHistory', async(req,res) => {
    try{
        const {email} = req.body;
        const orderHistory = await getOrderHistory(email);
        if(orderHistory){
            res.status(200).json({message:orderHistory});
        }
        else{
            res.status(200).json({message:"No order history"});
        }
    }
    catch(err){
        res.status(500).json({message:"Internal server error"});
    }
})

router.post('/verifyPayment',async(req,res) => {
    try{
        const order_id = req.body.order_id;
        const rzp_payment_id = req.body.razorpay_payment_id;
        const secretKey= process.env.KEY_SECRET;
        const razorpay_sign = req.body.razorpay_signature;

        //verify signatures
        const sign = order_id + "|" + rzp_payment_id;

        //create hmac object
        const signData= crypto.createHmac('sha256',secretKey).update(sign.toString()).digest('hex');

        //verify signature
        if(signData === razorpay_sign){
            return res.status(200).json({message:"Payment verified successfully"});
        }
        else{
            return res.status(400).json({message:"Invalid signature"});
        }

    }
    catch(err){
        res.status(500).json({data:"Internal server error during payment verification"});
    }
})

export const ordersRouter = router;
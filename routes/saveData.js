import express from 'express';
import jwt from 'jsonwebtoken';
import {generatePassword} from '../server.js';
import {findCustomer,findAdmin,updateNewPasswordForCustomer,updateNewPasswordForAdmin,saveAddress} from '../helper.js';

const router = express.Router();

router.put(`/saveNewPassword`, async(req,res) =>{
    let {token,password,loginUser} = req.body;
    let hashedPassword = await generatePassword(password);

    let obj ={
        password:hashedPassword,
        resetToken:""
    }
    
   try{
    let verify = jwt.verify(token,process.env.RESET_PASSWORD);
    let getToken,result;
    let email =verify.email;
    if(loginUser === "customer"){
        getToken = await findCustomer(email);
    }
    else{
        getToken = await findAdmin(email);
    }
    if(getToken.resetToken && loginUser === "customer"){
         result = await updateNewPasswordForCustomer(email, obj);
    }
    else{
        result = await updateNewPasswordForAdmin(email, obj);
    }

    if(result.acknowledged){
        res.status(200).send({msg:"Password changed successfully"});
    }
    else{
        res.status(400).send({error:"Error in changing password"});
    }
   }//try ends
   catch(error){
    res.status(500).send({error:error});
   }
})

router.post('/saveAddress', async(req,res) => {
    try{
        const {address,mobile,email} = req.body;
        const saveAddress = await saveAddress(email, address, mobile);
        if(saveAddress.modifiedCount){
            return res.status(200).json({message:"Address saved successfully"});
        }
        else{
            return res.status(200).json({message:"Error in saving address"});
        }
    }
    catch(err){
        res.status(500).json({message:"Interval server error"});
    }
})

export const saveDataRouter = router;
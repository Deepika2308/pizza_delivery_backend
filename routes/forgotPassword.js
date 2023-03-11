import express from 'express';
import jwt from 'jsonwebtoken';
import {sendResetLink} from '../mailer.js';
import {findCustomer,
    findAdmin,
    setJWTForAdmin,
    setJWTForCustomer} from '../helper.js';

const router = express.Router();

router.post("/verifyEmail", async(req,res) =>{
    let {email} = req.body;
    let result= await findCustomer(email);
    if(result){
        res.status(200).send({msg:true,isAdmin:false});
    }
    else{
        let adminResult= await findAdmin(email);
        if(adminResult){
            res.status(200).send({msg:true,isAdmin:true});
        }
        else{
            res.status(404).send({msg:false,isAdmin:false});
        }
    }
})

router.put("/sendResetLink", async(req,res) =>{
    let {email,isAdmin} = req.body;
    let result;

 let token = jwt.sign({email:email},process.env.RESET_PASSWORD,{expiresIn:'15m'});

 if(isAdmin){
     result = await setJWTForAdmin(email, token);    
 }
 else{
    result = await setJWTForCustomer(email, token);
 }
 
if(result.acknowledged){
    try{
        await sendResetLink({toMailId:email,token:token,isAdmin:isAdmin});
        res.status(200).send({msg:"mailsent"});
    }
    catch(err){
        res.status(500).send({msg:"Internal server error"});
    }  
}
})

export const forgotPasswordRouter = router;
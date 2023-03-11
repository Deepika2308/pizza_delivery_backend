import express from 'express';
import {registerCustomer,findAdmin,findCustomer,registerAdmin} from '../helper.js';
import {generatePassword,checkString} from '../server.js';

const router = express.Router(); 

//register user
router.post("/", async (req,res) => {
    const {first_name,last_name,email} = req.body;
    let customer ={};
    customer.first_name=first_name;
    customer.last_name=last_name;
    customer.email=email;
    let result,user;

     //if the email id belongs to admin save the user in admin collection
    //check if email id has 'pizzaadmin' string
    let isAdmin = checkString(email);
    
    try{
        //check if email id already present in db
        if(isAdmin){
            user = await findAdmin(email);
        }
        else{
            user = await findCustomer(email);
        }
         
    if(user){
        res.status(400).send({error:"Email is already registered with us"})
    }

    else{
        //hashing password
    let {password} =req.body;
    const hashedPass = await generatePassword(password);
    customer.password = hashedPass;

    if(isAdmin){
        //if it is admin registration store the user in admin collection
        customer.isAdmin = true;
         result = await registerAdmin(customer);
    }
    else{
        customer.isAdmin = false;
        //store user data in customer collection
         result = await registerCustomer(customer);
    }
    
    if(result){
        res.status(200).send({result:result});
    }
    }
}
    catch(err){
        console.log(err);
    }
    
})

export const registerRouter = router;
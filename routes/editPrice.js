import express from 'express';
import {auth} from "../middleware/auth.js";
import {findVegPizza,editVegPrice,findNonVegPizza,editNonVegPrice} from '../helper.js';

const router = express.Router();

//called when price is edited in admin page
router.patch("/:pizzaId",auth,async(req,res) => {
    try{
        let {pizzaId} = req.params;
        let {price} = req.body;
        let foundInVeg = await findVegPizza(pizzaId);
        
        if(foundInVeg){
            let updatedVegPrice = await editVegPrice(pizzaId, price);

            if(updatedVegPrice.acknowledged){
                res.status(200).json("Price Updated!!");
            }
            else{
                res.status(400).json("Error in updating price");
            }
        }
        else{
            let foundInNonVeg = await findNonVegPizza(pizzaId);
            if(foundInNonVeg){
                let updatedNonVegPrice = await editNonVegPrice(pizzaId, price);
                if(updatedNonVegPrice.modifiedCount){
                    res.status(200).json("Price Updated");
                }
                else{
                    res.status(400).json("Error in updating price");
                }
            }
            else{
                res.status(404).json("Pizza not found");
            }
        }
    }
    catch(err){
        res.status(500).json({error:"Internal server error in fetching details"});
    }
})

export const editPriceRouter = router;
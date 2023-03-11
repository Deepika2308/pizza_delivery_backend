import express from 'express';
import {deleteVegPizza,deleteNonVegPizza} from '../helper.js';

const router = express.Router();

router.delete("/deleteVegPizza/:pizzaId", async(req,res) => {
    try{
        let {pizzaId} = req.params;
        await deleteVegPizza(pizzaId);
        res.status(200).json("Deleted successfully");
    }
    catch(err){
        res.status(500).json({error:"Internal server error. Please try again after sometime."});
    }
})

router.delete("/deleteNonVegPizza/:pizzaId", async(req,res) => {
    try{
        let {pizzaId} = req.params;
        await deleteNonVegPizza(pizzaId);
        res.status(200).json("Deleted successfully");
    }
    catch(err){
        res.status(500).json({error:"Internal server error. Please try again after sometime."});
    }
})

export const deleteRouter = router;
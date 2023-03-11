import express from 'express';
import {addVegMenu,addNonVegMenu} from '../helper.js';

const router = express.Router();

router.post("/addVegMenu",async (req,res) => {
    try{
        const newMenu = req.body;
        let addMenu = await addVegMenu(newMenu);
        if(addMenu){
            res.status(200).json({data:"Menu added successfully"});
        }
        else{
            res.status(400).json({data:"Not able to insert the new menu. Check the request."});
        }
        
    }
    catch(err){
        res.status(500).json({error:"Internal server error. Error in adding menu to the database."})
    }
})

router.post("/addNonVegMenu",async (req,res) => {
    try{
        const newMenu = req.body;
        let addMenu = await addNonVegMenu(newMenu);
        if(addMenu){
            res.status(200).json({data:"Menu added successfully"});
        }
        else{
            res.status(400).json({data:"Not able to insert the new menu. Check the request."});
        }
        
    }
    catch(err){
        res.status(500).json({error:"Internal server error. Error in adding menu to the database."})
    }
})

export const addMenuRouter =router;
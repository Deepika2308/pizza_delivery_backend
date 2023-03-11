import express from "express";
import {getVegPizzas,
    getDesserts,
    getBeverages,
    getSides,
    getNonVegPizzas,
    getCrusts,
    getBranches,
    findVegPizza,
    findNonVegPizza} from '../helper.js';

const router = express.Router();

//fetch veg pizzas 
router.get("/getVegPizzas",async(req,res) => {

    try{
        let result = await getVegPizzas();

    if(result){
        res.status(200).send({result:result});
    }
    else{
        res.status(404).send({error:"No records"});
    }
    }
    catch(err){
        console.log(err);
    }
    
})

//fetch Desserts 
router.get("/getDesserts",async(req,res) => {

    try{
        let result = await getDesserts();

    if(result){
        res.status(200).send({result:result});
    }
    else{
        res.status(404).send({error:"No records"});
    }
    }
    catch(err){
        console.log(err);
    }
    
})

//fetch Beverages 
router.get("/getBeverages",async(req,res) => {

    try{
        let result = await getBeverages();

    if(result){
        res.status(200).send({result:result});
    }
    else{
        res.status(404).send({error:"No records"});
    }
    }
    catch(err){
        console.log(err);
    }
})

//fetch sides 
router.get("/getSides",async(req,res) => {

    try{
        let result = await getSides();

    if(result){
        res.status(200).send({result:result});
    }
    else{
        res.status(404).send({error:"No records"});
    }
    }
    catch(err){
        console.log(err);
    }
    
})

//fetch non veg pizzas
router.get("/getNonVegPizzas",async(req,res) => {

    try{
        let result = await getNonVegPizzas();

    if(result){
        res.status(200).send({result:result});
    }
    else{
        res.status(404).send({error:"No records"});
    }
    }
    catch(err){
        console.log(err);
    }
})

//get all crusts
router.get("/getCrusts",async(req,res) => {
    try{
        let result = await getCrusts();

    if(result){
        res.status(200).send({result:result});
    }
    else{
        res.status(404).send({error:"No records"});
    }
    }
    catch(err){
        res.status(500).json({result:"Internal server error in fetching records"});
    }
})

//get the pizza branches from the city
router.get("/getBranches/:city",async (req,res) => {
    const {city} = req.params;
    try{
    const result = await getBranches(city);
    res.send(result.branches);
    }
    catch(err){
        console.log(err);
    }
})

router.get("/findPizza/:pizzaId", async(req,res) => {
    try{
        let {pizzaId} = req.params;
        let pizzaData = await findVegPizza(pizzaId);
        if(pizzaData){
            res.status(200).json(pizzaData);
        }
        else{
            let nonVegPizzaData = await findNonVegPizza(pizzaId);
            if(nonVegPizzaData){
                res.status(200).json(nonVegPizzaData);
            }
        }
    }
    catch(err){
        res.status(500).json({error:"Internal server error in fetching details"});
    }
})

export const itemsRouter = router;
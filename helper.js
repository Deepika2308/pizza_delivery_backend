import { client } from "./index.js";
import {ObjectId} from "mongodb";

async function updateNewPasswordForAdmin(email, obj) {
    return await client.db("pizza_delivery").collection("admin").updateOne({ email: email }, { $set: obj });
}

async function updateNewPasswordForCustomer(email, obj) {
    return await client.db("pizza_delivery").collection("customers").updateOne({ email: email }, { $set: obj });
}

async function findAdmin(email) {
    return await client.db("pizza_delivery").collection("admin").findOne({ email: email });
}

async function findCustomer(email) {
    return await client.db("pizza_delivery").collection("customers").findOne({ email: email });
}

async function setJWTForCustomer(email, token) {
    return await client.db("pizza_delivery").collection("customers").updateOne({ email: email }, { $set: { resetToken: token } });
}

async function setJWTForAdmin(email, token) {
    return await client.db("pizza_delivery").collection("admin").updateOne({ email: email }, { $set: { resetToken: token } });
}


async function editNonVegPrice(pizzaId, price) {
    return await client.db("pizza_delivery").collection("nonVeg_pizzas").updateOne({ _id: ObjectId(pizzaId) }, { $set: { price: price } });
}

async function findNonVegPizza(pizzaId) {
    return await client.db("pizza_delivery").collection("nonVeg_pizzas").findOne({ _id: ObjectId(pizzaId) });
}

async function editVegPrice(pizzaId, price) {
    return await client.db("pizza_delivery").collection("veg_pizzas").updateOne({ _id: ObjectId(pizzaId) }, { $set: { price: price } });
}

async function findVegPizza(pizzaId) {
    return await client.db("pizza_delivery").collection("veg_pizzas").findOne({ _id: ObjectId(pizzaId) });
}

async function deleteNonVegPizza(pizzaId) {
    await client.db("pizza_delivery").collection("nonVeg_pizzas").deleteOne({ _id: ObjectId(pizzaId) });
}

async function deleteVegPizza(pizzaId) {
    await client.db("pizza_delivery").collection("veg_pizzas").deleteOne({ _id: ObjectId(pizzaId) });
}


async function addNonVegMenu(newMenu) {
    return await client.db("pizza_delivery").collection("nonVeg_pizzas").insertOne(newMenu);
}

async function addVegMenu(newMenu) {
    return await client.db("pizza_delivery").collection("veg_pizzas").insertOne(newMenu);
}

async function saveAddress(email, address, mobile) {
    return await client.db("pizza_delivery").collection("customers").updateOne({ email: email }, { $set: { address: address, mobile: mobile } });
}

async function getOrderHistory(email) {
    return await client.db("pizza_delivery").collection("orders").find({ email: email }).sort({ _id: -1 }).toArray();
}

async function saveOrder(order) {
    return await client.db("pizza_delivery").collection("orders").insertOne(order);
}

async function getCrusts() {
    return await client.db("pizza_delivery").collection("crusts").find().toArray();
}

async function getNonVegPizzas() {
    return await client.db("pizza_delivery").collection("nonVeg_pizzas").find().toArray();
}

async function getSides() {
    return await client.db("pizza_delivery").collection("sides").find().toArray();
}

async function getBeverages() {
    return await client.db("pizza_delivery").collection("beverages").find().toArray();
}

async function getDesserts() {
    return await client.db("pizza_delivery").collection("desserts").find().toArray();
}

async function getVegPizzas() {
    return await client.db("pizza_delivery").collection("veg_pizzas").find().toArray();
}

function registerCustomer(customer) {
    return client.db("pizza_delivery").collection("customers").insertOne(customer);
}

function registerAdmin(customer) {
    return client.db("pizza_delivery").collection("admin").insertOne(customer);
}

async function getBranches(city) {
    return await client.db("pizza_delivery").collection("branches").findOne({ city: city });
}


export {
getBranches,
registerCustomer,
registerAdmin,
updateNewPasswordForAdmin,
updateNewPasswordForCustomer,
findAdmin,
findCustomer,
setJWTForCustomer,
setJWTForAdmin,
editNonVegPrice,
findNonVegPizza,
editVegPrice,
findVegPizza,
deleteNonVegPizza,
deleteVegPizza,
addNonVegMenu,
addVegMenu,
saveAddress,
getOrderHistory,
saveOrder,
getCrusts,
getNonVegPizzas,
getSides,
getBeverages,
getDesserts,
getVegPizzas,
}
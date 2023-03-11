import express from "express";
import {MongoClient} from "mongodb";
import cors from "cors";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import http from 'http';
import {Server} from 'socket.io';
import {sendOrderToAdmin} from './mailer.js';
import {itemsRouter} from './routes/items.js';
import {ordersRouter} from './routes/orders.js';
import {addMenuRouter} from './routes/addMenu.js';
import {deleteRouter} from './routes/deleteMenu.js';
import {saveDataRouter} from './routes/saveData.js';
import {loginRouter} from './routes/login.js';
import {editPriceRouter} from './routes/editPrice.js';
import {forgotPasswordRouter} from './routes/forgotPassword.js';
import {registerRouter} from './routes/registerUser.js';

dotenv.config();
const app= express();
app.use(cors());
app.use(express.json());
const PORT = 5001;
const MONGO_URL ="mongodb://localhost";

const server = http.createServer(app);
const io= new Server(server, {
    cors:{
        origin:"http://localhost:3000",
    }
});


io.on("connection", (socket) => {

    socket.on("paymentVerified", async(order) => {
        try{
         await sendOrderToAdmin({toMailId:process.env.ADMIN_EMAIL,order:order});
         io.to(socket.id).emit("OrderConfirmed",{orderConfirmed:true});
        }
        catch(err){
            console.log(err);
        }
    })

    socket.on("order_confirmed",() => {
        io.to(socket.id).emit("notification_message",{message:"Your order is confirmed"});
    })
    socket.on("Your order is confirmed" ,() =>{
        io.to(socket.id).emit("notification_message",{message:"Your order is being prepared"});
    })
    socket.on("Your order is being prepared" ,() =>{
        io.to(socket.id).emit("notification_message",{message:"Your order is being packed"});
    })
    socket.on("Your order is being packed" ,() =>{
        io.to(socket.id).emit("notification_message",{message:"Your order is on the way"});
    })
    socket.on("Your order is on the way",() =>{
        io.to(socket.id).emit("notification_message",{message:"Your order has been delivered"});
    })
})

async function connectDb(){
    const client =  new MongoClient(MONGO_URL);
    await client.connect();
    console.log("***Connected to Mongo DB***");
    return client;
}

export const client = await connectDb();

app.get("/",(req,res) =>{
    res.send("This is Pizza delivery API");
})

export async function generatePassword(password){
    const saltValue = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(password,saltValue);
    return hashedPassword;
}

//check string function
export function checkString(email) {
    if(email === process.env.ADMIN_EMAIL){
        return true;
    }
    else{
        return false;
    }
}

//fetch razorpay key id
app.get('/getKeyId', async(req,res) => {
    try{
        const key = process.env.KEY_ID;
        return res.status(200).json({data:process.env.KEY_ID});
    }
    catch(err){
        res.status(500).json({data:"Internal server error.Error in fetching razorpay Key"});
    }
})

app.use("/items",itemsRouter);
app.use("/order",ordersRouter);
app.use("/addMenu",addMenuRouter);
app.use("/delete",deleteRouter);
app.use("/save",saveDataRouter);
app.use("/login",loginRouter);
app.use("/editPrice",editPriceRouter);
app.use('/forgotPassword',forgotPasswordRouter);
app.use('/registerUser',registerRouter);

server.listen(PORT, () => console.log(`App is listening to port ${PORT}`));
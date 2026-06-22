import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import { User } from './model/user.js';
import { Product } from './model/product.js';

import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import addressRoutes from "./routes/address.routes.js";
import wishlistRoutes from "./routes/wishList.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import http from "http";


import cors from "cors";
import { connectToSocket } from './controller/socketManager.js';

const app = express();
const port = process.env.PORT || 9000;

const httpServer = http.createServer(app);

const io = connectToSocket(httpServer);

app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}));

app.set("port", (process.env.PORT) || 9000);
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/uploads", uploadRoutes);
app.use("/api/v1/products/", productRoutes);
app.use("/api/v1/carts", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/address", addressRoutes);
app.use("/api/v1/wishlists", wishlistRoutes);
app.use("/api/v1/notifications", notificationRoutes);



const start = async ()=>{
    const connectionDB = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MONGO connected DB host : ${connectionDB.connection.host}`);

    httpServer.listen((app.get("port")),()=>{
        console.log(`LISTENING ON PORT NO ${app.get("port")}`);
    });
}

start();
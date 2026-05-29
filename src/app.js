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
import wishlistRoutes from "./routes/wishList.routes.js"

import cors from "cors";

const app = express();
const port = 9000;

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

app.set("port", (process.env.PORT) || 9000);
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products/", productRoutes);
app.use("/api/v1/carts", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/address", addressRoutes);
app.use("/api/v1/wishlists", wishlistRoutes);


const start = async ()=>{
    const connectionDB = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MONGO connected DB host : ${connectionDB.connection.host}`);

    app.listen((app.get("port")),()=>{
        console.log(`LISTENING ON PORT NO ${app.get("port")}`);
    })
}

start();
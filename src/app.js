import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import { User } from './model/user.js';
import { Product } from './model/product.js';

import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
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


const start = async ()=>{
    const connectionDB = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MONGO connected DB host : ${connectionDB.connection.host}`);

    app.listen((app.get("port")),()=>{
        console.log(`LISTENING ON PORT NO ${app.get("port")}`);
    })
}

start();

// app.get('/', (req, res)=>{
//     res.send("this is a sample route");
// });

// dummy user 
// const user1 = {
//     name: "Rahul Sharma",
//     email: "rahul.sharma@gmail.com",
//     password: "password123",
//     role: "user",
//     phone: "9876543210",
//     address: {
//       street: "123 Model Town",
//       city: "Ludhiana",
//       state: "Punjab",
//       pincode: "141001"
//     }
//   };

  // dummy product database
//   const product1 = {
//     name: "iPhone 13",
//     description: "Apple iPhone 13 with A15 Bionic chip, 128GB storage",
//     price: 65000,
//     category: "electronics",
//     brand: "Apple",
//     stock: 10,
//     image: [
//       "https://example.com/images/iphone13-1.jpg",
//       "https://example.com/images/iphone13-2.jpg"
//     ],
//     isActive: true
//   }

//   const saveUser = async ()=>{
//     try{
//         const newUser = new User(user1);
//     await newUser.save();
//     console.log("User Save successfully!");
//     } catch(err){
//         console.log("something went wrong", err);
//     }
//   }

//   const saveProduct = async () =>{
//     try{
//         const newProduct = new Product(product1);
//         await newProduct.save();
//         console.log("product data save successfully in the database");
//     } catch(err){
//         console.log("something went wrong ");
//     }
//   }

// saveProduct();
//   saveUser();

// app.listen(port, ()=>{
//     console.log(`the server listen on port no ${port}`);
// })
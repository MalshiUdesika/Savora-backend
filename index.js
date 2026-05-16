import express from "express"
import mongoose from "mongoose"
import userRouter from "./router/userRouter.js"
import authorizeUser from "./lib/jwtMiddlewere.js"
import productRouter from "./router/productRouter.js"
import cors from 'cors'
import dotenv from 'dotenv'
import orderRouter from "./router/orderRouter.js"
import { createUser, loginUser, googleLogin } from "./controllers/userController.js"
import itemRouter from "./router/itemRouter.js"

dotenv.config()


const mongoURI = process.env.MONGO_URI

mongoose.connect(mongoURI).then(
    ()=>{
        console.log("Connected to mongoDB")
    }
).catch(
    ()=>{
        console.log("Error connecting to mongoDB")
    }
)

const app = express()


app.use(cors())

app.use(express.json())

app.use('/images', express.static('images'))

// Public routes (no auth required)
app.post("/api/users", createUser)
app.post("/api/users/login", loginUser)
app.post("/api/users/google-login", googleLogin)

// Apply auth middleware for protected routes
app.use(authorizeUser)

app.use("/api/users", userRouter)
app.use("/api/items", itemRouter)
app.use("/api/orders", orderRouter)

function start(){
    console.log("Server started on port 3000")
}

app.listen(3000, start)
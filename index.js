import express from 'express';
import mongoose from 'mongoose';

const mongoURI = process.env.mongoURI

mongoose.connect(mongoURI);

mongoose.connect(mongoURI).then(
    ()=>{
        console.log("Connected to mongoDB")
    }
).catch(
    ()=>{
        console.log("Error connecting to mongoDB")
    }
)

const app = express();

app.use(express.json());


function start(){
    console.log("Server started on port 5000.")
}

app.listen(5000, start)
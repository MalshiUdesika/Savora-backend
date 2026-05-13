import express from 'express';
import mongoose from 'mongoose';

let mongoURI = "mongodb+srv://admin:1234@cluster0.ogiafsm.mongodb.net/?appName=Cluster0"

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
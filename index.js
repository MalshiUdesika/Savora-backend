import express from 'express';

const app = express();

app.use(express.json());


function start(){
    console.log("Server started on port 5000.")
}

app.listen(5000, start)
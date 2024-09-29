import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from './utils/database.js';
dotenv.config({});

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

const PORT = 8000;
app.listen(PORT, ()=>{
    connectDb
    console.log(`Server Running at ${PORT}`);
})
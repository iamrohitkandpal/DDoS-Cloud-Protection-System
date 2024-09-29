import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from './utils/database.js';
import bodyParser from "body-parser";

dotenv.config({});

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Backend Relation"
    })
})

const PORT = 8000;
app.listen(PORT, ()=>{
    connectDb
    console.log(`Server Running at ${PORT}`);
})
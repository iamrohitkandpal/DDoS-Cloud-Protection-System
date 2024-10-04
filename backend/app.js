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


app.post('/api/logs', (req, res) => {
    const { ipAddress, requestPath } = req.body;
    const logEntry = new TrafficLog({ ipAddress, requestTime: new Date(), requestPath });
    
    logEntry.save()
        .then(() => res.status(201).send(logEntry))
        .catch(err => res.status(500).json({ error: 'Failed to log traffic' }));
});

app.get('/api/logs', (req, res) => {
    TrafficLog.find()
        .then(logs => res.status(200).json(logs))
        .catch(err => res.status(500).json({ error: 'Failed to fetch logs' }));
});


const PORT = 8000;
app.listen(PORT, ()=>{
    connectDb
    console.log(`Server Running at ${PORT}`);
})
import { mongoose } from 'mongoose';

const TrafficLogSchema = new mongoose.Schema({
    ipAddress: String,  // IP Address of the request
    requestTime: Date,  // Time of the request
    requestPath: String // Path of the request
}, {timestamps: true});

export const TrafficLog = mongoose.model('TrafficLog', TrafficLogSchema);

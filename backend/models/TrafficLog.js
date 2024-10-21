import mongoose from 'mongoose';

const trafficLogSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true,
  },
  requestTime: {
    type: Date,
    required: true,
  },
  requestPath: {
    type: String,
    required: true,
  },
});

const TrafficLog = mongoose.model('TrafficLog', trafficLogSchema);

export { TrafficLog };

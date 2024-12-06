import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  resourceType: {
    type: String,
    required: true,
    enum: ['booking', 'service', 'vehicle', 'user', 'settings', 'testimonial', 'slider']
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

const Log = mongoose.models.Log || mongoose.model("Log", LogSchema);

export default Log; 
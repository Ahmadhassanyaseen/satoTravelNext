import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String },
  price: { type: Number, required: true },
  locationFrom: { type: String },
  locationTo: { type: String },
  days: { type: Number, required: true },
  maxPeople: { type: Number, required: true },
  itinerary: { type: String },
  vehicleId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  status: { 
    type: String, 
    default: 'available',
    enum: ['available', 'booked', 'maintenance'] 
  }
}, {
  timestamps: true
});

const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema);

export default Service;

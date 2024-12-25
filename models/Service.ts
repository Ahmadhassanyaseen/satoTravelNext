import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  imagePublicId: { type: String },
  images: [{ type: String }],
  imagesPublicIds: [{ type: String }],
  locationFrom: { type: String },
  locationTo: { type: String },
  duration: { type: String },
  vehicleId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  status: { 
    type: String, 
    default: 'active',
    enum: ['active', 'inactive'] 
  }
}, {
  timestamps: true
});

const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema);

export default Service;

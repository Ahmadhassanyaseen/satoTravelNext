import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vehicle name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  passengerQuantity: {
    type: Number,
    required: [true, 'Passenger quantity is required'],
    min: [1, 'Passenger quantity must be at least 1'],
  },
  type: {
    type: String,
    required: [true, 'Vehicle type is required'],
    enum: ['Car', 'Van', 'Bus', 'Minibus'],
    default: 'Car',
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);

export default Vehicle; 
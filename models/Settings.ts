import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  websiteTitle: {
    type: String,
    required: [true, 'Website title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Website description is required'],
    trim: true,
  },
  logo: {
    type: String,
    required: [true, 'Logo URL is required'],
  },
  email: {
    type: String,
    required: [true, 'Contact email is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Contact phone is required'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
  },
  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
  }
}, {
  timestamps: true,
});

const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

export default Settings; 
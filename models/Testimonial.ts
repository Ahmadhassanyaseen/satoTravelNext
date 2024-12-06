import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true
});

const Testimonial = mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);

export default Testimonial; 
import mongoose from 'mongoose';

const PaymentMethodSchema = new mongoose.Schema({
  cardHolder: {
    type: String,
    required: true
  },
  cardNumber: {
    type: String,
    required: true
  },
  expiryDate: {
    type: String,
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure only one default card
PaymentMethodSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await (this.constructor as typeof PaymentMethod).updateMany(
      { _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

const PaymentMethod = mongoose.models.PaymentMethod || mongoose.model('PaymentMethod', PaymentMethodSchema);

export default PaymentMethod; 
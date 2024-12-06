export interface CreditCard {
  _id: string;
  userId: string;
  cardHolder: string;
  cardNumber: string; // Last 4 digits only
  expiryDate: string;
  isDefault: boolean;
  createdAt: string;
} 
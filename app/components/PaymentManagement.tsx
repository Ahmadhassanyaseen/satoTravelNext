'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faTrash, faStar } from '@fortawesome/free-solid-svg-icons';
import type { CreditCard } from '@/types';

export default function PaymentManagement() {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
  });

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/payment-methods');
      if (!response.ok) throw new Error('Failed to fetch cards');
      const data = await response.json();
      setCards(data);
    } catch (error: unknown) {
      toast.error('Failed to load payment methods');
      console.error('Error fetching cards:', error);
    } finally {
      console.log(isLoading);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to add card');
      
      toast.success('Card added successfully');
      setShowAddForm(false);
      setFormData({ cardHolder: '', cardNumber: '', expiryDate: '' });
      fetchCards();
    } catch (error: unknown) {
      toast.error('Failed to add card');
      console.error('Error adding card:', error);
    }
  };

  const handleDelete = async (cardId: string) => {
    try {
      const response = await fetch(`/api/payment-methods/${cardId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete card');
      
      toast.success('Card deleted successfully');
      fetchCards();
    } catch (error: unknown) {
      toast.error('Failed to delete card');
      console.error('Error deleting card:', error);
    }
  };

  const setDefaultCard = async (cardId: string) => {
    try {
      const response = await fetch(`/api/payment-methods/${cardId}/default`, {
        method: 'PUT',
      });

      if (!response.ok) throw new Error('Failed to set default card');
      
      toast.success('Default card updated');
      fetchCards();
    } catch (error: unknown) {
      toast.error('Failed to update default card');
      console.error('Error updating default card:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Payment Methods</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add New Card
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Card Holder Name</label>
              <input
                type="text"
                value={formData.cardHolder}
                onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Card Number</label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                className="w-full p-2 border rounded-lg"
                maxLength={16}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <input
                type="text"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                placeholder="MM/YY"
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Add Card
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {cards.map((card) => (
          <div key={card._id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-4">
              <FontAwesomeIcon icon={faCreditCard} className="text-2xl text-blue-500" />
              <div>
                <p className="font-medium">{card.cardHolder}</p>
                <p className="text-sm text-gray-500">**** **** **** {card.cardNumber}</p>
                <p className="text-sm text-gray-500">Expires: {card.expiryDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDefaultCard(card._id)}
                className={`p-2 rounded-full ${card.isDefault ? 'text-yellow-500' : 'text-gray-400'}`}
                title={card.isDefault ? 'Default Card' : 'Set as Default'}
              >
                <FontAwesomeIcon icon={faStar} />
              </button>
              <button
                onClick={() => handleDelete(card._id)}
                className="p-2 text-red-500 rounded-full hover:bg-red-50"
                title="Delete Card"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
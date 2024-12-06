import axios from 'axios';

const API_BASE_URL = '/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status: 'active' | 'inactive';
}

export const userService = {
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/allUsers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  createUser: async (userData: Omit<User, '_id'>) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/create`, userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  updateUser: async (_id: string, userData: Partial<User>) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${_id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  deleteUser: async (_id: string) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/users/${_id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}; 
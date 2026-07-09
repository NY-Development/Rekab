import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

export const joinWaitlist = async (email: string) => {
  const { data } = await api.post('/waitlist/join', { email });
  return data;
};
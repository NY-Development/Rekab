import api from './axios';

export interface ContactPayload {
  name: string;
  email: string;
  topic?: string;
  message: string;
}

export const contactsApi = {
  submit: (data: ContactPayload) => api.post('/contacts', data),
};

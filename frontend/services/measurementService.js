import api from './api';

export const measurementService = {
  async getAll() {
    const res = await api.get('/measurements/');
    return Array.isArray(res.data) ? res.data : (res.data.results || []);
  },

  async create(data) {
    const res = await api.post('/measurements/', data);
    return res.data;
  },

  async delete(id) {
    const res = await api.delete(`/measurements/${id}/`);
    return res.data;
  },
};

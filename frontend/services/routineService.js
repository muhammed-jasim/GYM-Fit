import api from './api';

export const routineService = {
  async getAll() {
    const res = await api.get('/routines/');
    return Array.isArray(res.data) ? res.data : (res.data.results || []);
  },

  async getById(id) {
    const res = await api.get(`/routines/${id}/`);
    return res.data;
  },

  async create(data) {
    const res = await api.post('/routines/', data);
    return res.data;
  },

  async update(id, data) {
    const res = await api.put(`/routines/${id}/`, data);
    return res.data;
  },

  async delete(id) {
    const res = await api.delete(`/routines/${id}/`);
    return res.data;
  },

  async clone(id, name) {
    const res = await api.post(`/routines/${id}/clone/`, { name });
    return res.data;
  },
};

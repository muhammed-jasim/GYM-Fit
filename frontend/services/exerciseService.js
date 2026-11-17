import api from './api';

export const exerciseService = {
  async getAll(params = {}) {
    const res = await api.get('/exercises/', { params });
    // DRF may return array or paginated object { results: [...] }
    return Array.isArray(res.data) ? res.data : (res.data.results || []);
  },

  async getById(id) {
    const res = await api.get(`/exercises/${id}/`);
    return res.data;
  },

  async create(data) {
    const res = await api.post('/exercises/', data);
    return res.data;
  },

  async update(id, data) {
    const res = await api.patch(`/exercises/${id}/`, data);
    return res.data;
  },

  async delete(id) {
    const res = await api.delete(`/exercises/${id}/`);
    return res.data;
  },
};

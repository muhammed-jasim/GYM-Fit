import api from './api';

export const achievementService = {
  async getAll() {
    const res = await api.get('/achievements/');
    return Array.isArray(res.data) ? res.data : (res.data.results || []);
  },

  async evaluate() {
    const res = await api.post('/achievements/evaluate/');
    return res.data;
  },
};

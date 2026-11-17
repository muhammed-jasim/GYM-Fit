import api from './api';

export const workoutService = {
  async getAll(params = {}) {
    const res = await api.get('/workouts/', { params });
    return Array.isArray(res.data) ? res.data : (res.data.results || []);
  },

  async getById(id) {
    const res = await api.get(`/workouts/${id}/`);
    return res.data;
  },

  async getActive() {
    const res = await api.get('/workouts/active/');
    return res.data;
  },

  async create(data) {
    const res = await api.post('/workouts/', data);
    return res.data;
  },

  async update(id, data) {
    const res = await api.patch(`/workouts/${id}/`, data);
    return res.data;
  },

  async delete(id) {
    const res = await api.delete(`/workouts/${id}/`);
    return res.data;
  },

  async syncBatch(workouts) {
    const res = await api.post('/workouts/sync_batch/', { workouts });
    return res.data;
  },

  async getPreviousPerformance(exerciseIds = []) {
    const params = {};
    if (exerciseIds && exerciseIds.length > 0) {
      params.exercise_ids = exerciseIds.join(',');
    }
    const res = await api.get('/workouts/previous-performance/', { params });
    return res.data;
  },
};

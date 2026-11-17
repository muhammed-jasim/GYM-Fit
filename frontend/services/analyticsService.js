import api from './api';

export const analyticsService = {
  async getDashboardSummary() {
    const res = await api.get('/analytics/dashboard/');
    return res.data;
  },

  async getExerciseProgression(exerciseId) {
    const res = await api.get(`/analytics/progression/${exerciseId}/`);
    return res.data;
  },

  async getPersonalRecords(exerciseId = null) {
    const params = exerciseId ? { exercise: exerciseId } : {};
    const res = await api.get('/analytics/records/', { params });
    return Array.isArray(res.data) ? res.data : (res.data.results || []);
  },
};

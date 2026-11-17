import api from './api';

export const authService = {
  async login(username, password) {
    const res = await api.post('/auth/login/', { username, password });
    const { access, refresh } = res.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('fit_access_token', access);
      localStorage.setItem('fit_refresh_token', refresh);
    }
    const userRes = await api.get('/auth/me/');
    if (typeof window !== 'undefined') {
      localStorage.setItem('fit_user', JSON.stringify(userRes.data));
    }
    return userRes.data;
  },

  async register(data) {
    const res = await api.post('/auth/register/', data);
    const { user, tokens } = res.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('fit_access_token', tokens.access);
      localStorage.setItem('fit_refresh_token', tokens.refresh);
      localStorage.setItem('fit_user', JSON.stringify(user));
    }
    return user;
  },

  async demoLogin() {
    const res = await api.post('/auth/demo-login/');
    const { user, tokens } = res.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('fit_access_token', tokens.access);
      localStorage.setItem('fit_refresh_token', tokens.refresh);
      localStorage.setItem('fit_user', JSON.stringify(user));
    }
    return user;
  },

  async continueWithGoogle(googleData) {
    const res = await api.post('/auth/google/', googleData);
    const { user, tokens } = res.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('fit_access_token', tokens.access);
      localStorage.setItem('fit_refresh_token', tokens.refresh);
      localStorage.setItem('fit_user', JSON.stringify(user));
    }
    return user;
  },

  async getCurrentUser() {
    const res = await api.get('/auth/me/');
    if (typeof window !== 'undefined') {
      localStorage.setItem('fit_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await api.patch('/auth/me/', profileData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fit_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  async changePassword(currentPassword, newPassword) {
    const res = await api.post('/auth/change-password/', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return res.data;
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fit_access_token');
      localStorage.removeItem('fit_refresh_token');
      localStorage.removeItem('fit_user');
      window.location.href = '/login';
    }
  },

  getStoredUser() {
    if (typeof window === 'undefined') return null;
    try {
      const u = localStorage.getItem('fit_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('fit_access_token');
  },
};

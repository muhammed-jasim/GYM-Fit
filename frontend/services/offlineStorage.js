const ACTIVE_WORKOUT_KEY = 'fit_active_workout';
const OFFLINE_QUEUE_KEY = 'fit_offline_workouts_queue';

export const offlineStorage = {
  // Active Workout in progress
  saveActiveWorkout(workout) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify(workout));
    } catch (e) {
      console.error('Failed to save active workout locally', e);
    }
  },

  getActiveWorkout() {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(ACTIVE_WORKOUT_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to retrieve active workout', e);
      return null;
    }
  },

  clearActiveWorkout() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(ACTIVE_WORKOUT_KEY);
    } catch (e) {
      console.error('Failed to clear active workout', e);
    }
  },

  // Completed workouts queued for sync
  queueCompletedWorkout(workout) {
    if (typeof window === 'undefined') return;
    try {
      const queue = this.getOfflineQueue();
      // Ensure unique client_id
      if (!workout.client_id) {
        workout.client_id = `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      }
      queue.push(workout);
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.error('Failed to queue offline workout', e);
    }
  },

  getOfflineQueue() {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to read offline queue', e);
      return [];
    }
  },

  clearOfflineQueue() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(OFFLINE_QUEUE_KEY);
    } catch (e) {
      console.error('Failed to clear offline queue', e);
    }
  },
};

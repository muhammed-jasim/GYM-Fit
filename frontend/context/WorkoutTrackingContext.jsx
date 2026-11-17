'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { workoutService } from '../services/workoutService';
import { offlineStorage } from '../services/offlineStorage';

const WorkoutTrackingContext = createContext(null);

export function WorkoutTrackingProvider({ children }) {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(0);

  // Rest Timer State
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);
  const [restSecondsRemaining, setRestSecondsRemaining] = useState(0);
  const [restTotalSeconds, setRestTotalSeconds] = useState(90);

  // Offline Sync State
  const [isOnline, setIsOnline] = useState(true);
  const [offlineCount, setOfflineCount] = useState(0);

  const timerRef = useRef(null);
  const restTimerRef = useRef(null);

  // Load persisted active workout and offline queue on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const savedWorkout = offlineStorage.getActiveWorkout();
    if (savedWorkout) {
      setActiveWorkout(savedWorkout);
      setIsActive(true);
      if (savedWorkout.started_at) {
        const elapsed = Math.floor((Date.now() - new Date(savedWorkout.started_at).getTime()) / 1000);
        setDuration(elapsed > 0 ? elapsed : 0);
      }
    }

    setOfflineCount(offlineStorage.getOfflineQueue().length);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Main workout elapsed timer
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  // Rest countdown timer
  useEffect(() => {
    if (isRestTimerActive && restSecondsRemaining > 0) {
      restTimerRef.current = setInterval(() => {
        setRestSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(restTimerRef.current);
            setIsRestTimerActive(false);
            playRestTimerBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (restSecondsRemaining <= 0) {
      setIsRestTimerActive(false);
      clearInterval(restTimerRef.current);
    }
    return () => clearInterval(restTimerRef.current);
  }, [isRestTimerActive, restSecondsRemaining]);

  // Audio tone cue for rest timer completion
  const playRestTimerBeep = () => {
    try {
      if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch (e) {
      // Audio might be blocked by browser policy until user interacts
    }
  };

  // Persist active workout on updates
  const updateAndPersist = (updated) => {
    setActiveWorkout(updated);
    offlineStorage.saveActiveWorkout(updated);
  };

  const startWorkout = ({ title, routineDayId = null, initialExercises = [] }) => {
    const started = new Date().toISOString();
    const newWorkout = {
      client_id: `fit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: title || 'Workout Session',
      routine_day: routineDayId,
      started_at: started,
      duration_seconds: 0,
      notes: '',
      rating: 5,
      exercises: initialExercises.map((item, exIdx) => {
        const ex = item.exercise || item;
        let sets = [];

        if (Array.isArray(item.sets_data) && item.sets_data.length > 0) {
          sets = item.sets_data.map((s, sIdx) => ({
            set_number: s.set_number || sIdx + 1,
            set_type: s.set_type || 'normal',
            weight_kg: Number(s.weight_kg) || 0,
            reps: Number(s.reps) || 10,
            rpe: Number(s.rpe || item.target_rpe) || 8.0,
            completed: false,
            rest_seconds: item.rest_seconds || 90,
            order: sIdx,
          }));
        } else {
          const numSets = Number(item.target_sets) || 3;
          let parsedReps = 10;
          if (typeof item.target_reps === 'number') {
            parsedReps = item.target_reps;
          } else if (typeof item.target_reps === 'string') {
            const match = item.target_reps.match(/\d+/);
            if (match) parsedReps = parseInt(match[0], 10);
          }
          const parsedWeight = parseFloat(item.target_weight) || 0;

          sets = Array.from({ length: numSets }).map((_, sIdx) => ({
            set_number: sIdx + 1,
            set_type: 'normal',
            weight_kg: parsedWeight,
            reps: parsedReps,
            rpe: item.target_rpe || 8.0,
            completed: false,
            rest_seconds: item.rest_seconds || 90,
            order: sIdx,
          }));
        }

        return {
          exercise: ex,
          order: exIdx,
          sets,
        };
      }),
    };

    setActiveWorkout(newWorkout);
    setIsActive(true);
    setDuration(0);
    offlineStorage.saveActiveWorkout(newWorkout);
  };

  const addExercise = (exercise) => {
    if (!activeWorkout) return;
    const newExercises = [
      ...activeWorkout.exercises,
      {
        exercise,
        order: activeWorkout.exercises.length,
        sets: [
          {
            set_number: 1,
            set_type: 'normal',
            weight_kg: 0,
            reps: 10,
            rpe: 8.0,
            completed: false,
            rest_seconds: 90,
            order: 0,
          },
        ],
      },
    ];
    updateAndPersist({ ...activeWorkout, exercises: newExercises });
  };

  const removeExercise = (exerciseIndex) => {
    if (!activeWorkout) return;
    const filtered = activeWorkout.exercises.filter((_, idx) => idx !== exerciseIndex);
    updateAndPersist({ ...activeWorkout, exercises: filtered });
  };

  const addSet = (exerciseIndex) => {
    if (!activeWorkout) return;
    const currentEx = activeWorkout.exercises[exerciseIndex];
    if (!currentEx) return;

    const lastSet = currentEx.sets[currentEx.sets.length - 1];
    const newSet = {
      set_number: currentEx.sets.length + 1,
      set_type: 'normal',
      weight_kg: lastSet ? lastSet.weight_kg : 0,
      reps: lastSet ? lastSet.reps : 10,
      rpe: lastSet ? lastSet.rpe : 8.0,
      completed: false,
      rest_seconds: lastSet ? lastSet.rest_seconds : 90,
      order: currentEx.sets.length,
    };

    const updatedExercises = [...activeWorkout.exercises];
    updatedExercises[exerciseIndex] = {
      ...currentEx,
      sets: [...currentEx.sets, newSet],
    };

    updateAndPersist({ ...activeWorkout, exercises: updatedExercises });
  };

  const removeSet = (exerciseIndex, setIndex) => {
    if (!activeWorkout) return;
    const currentEx = activeWorkout.exercises[exerciseIndex];
    if (!currentEx || currentEx.sets.length <= 1) return;

    const filteredSets = currentEx.sets
      .filter((_, idx) => idx !== setIndex)
      .map((s, idx) => ({ ...s, set_number: idx + 1, order: idx }));

    const updatedExercises = [...activeWorkout.exercises];
    updatedExercises[exerciseIndex] = {
      ...currentEx,
      sets: filteredSets,
    };

    updateAndPersist({ ...activeWorkout, exercises: updatedExercises });
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    if (!activeWorkout) return;
    const updatedExercises = [...activeWorkout.exercises];
    const currentEx = updatedExercises[exerciseIndex];
    if (!currentEx) return;

    const updatedSets = [...currentEx.sets];
    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      [field]: value,
    };

    updatedExercises[exerciseIndex] = {
      ...currentEx,
      sets: updatedSets,
    };

    updateAndPersist({ ...activeWorkout, exercises: updatedExercises });
  };

  const toggleSetCompleted = (exerciseIndex, setIndex) => {
    if (!activeWorkout) return;
    const currentEx = activeWorkout.exercises[exerciseIndex];
    const targetSet = currentEx?.sets[setIndex];
    if (!targetSet) return;

    const newCompleted = !targetSet.completed;
    updateSet(exerciseIndex, setIndex, 'completed', newCompleted);

    // If just completed, start rest timer
    if (newCompleted) {
      startRestTimer(targetSet.rest_seconds || 90);
    }
  };

  const startRestTimer = (seconds) => {
    setRestTotalSeconds(seconds);
    setRestSecondsRemaining(seconds);
    setIsRestTimerActive(true);
  };

  const stopRestTimer = () => {
    setIsRestTimerActive(false);
    setRestSecondsRemaining(0);
  };

  const addRestTime = (secondsToAdd = 30) => {
    setRestSecondsRemaining((prev) => prev + secondsToAdd);
    setRestTotalSeconds((prev) => prev + secondsToAdd);
  };

  const updateWorkoutMeta = (fields) => {
    if (!activeWorkout) return;
    updateAndPersist({ ...activeWorkout, ...fields });
  };

  const finishWorkout = async () => {
    if (!activeWorkout) return null;

    // Build flat set list for API
    const flatSets = [];
    activeWorkout.exercises.forEach((exGroup) => {
      exGroup.sets.forEach((s) => {
        flatSets.push({
          exercise_id: exGroup.exercise.id,
          set_number: s.set_number,
          set_type: s.set_type,
          weight_kg: parseFloat(s.weight_kg) || 0,
          reps: parseInt(s.reps, 10) || 0,
          rpe: s.rpe ? parseFloat(s.rpe) : null,
          completed: s.completed,
          rest_seconds: s.rest_seconds || 60,
          order: s.order,
        });
      });
    });

    const payload = {
      client_id: activeWorkout.client_id,
      title: activeWorkout.title,
      routine_day: activeWorkout.routine_day,
      started_at: activeWorkout.started_at,
      completed_at: new Date().toISOString(),
      duration_seconds: duration,
      status: 'completed',
      notes: activeWorkout.notes || '',
      rating: activeWorkout.rating || 5,
      sets: flatSets,
    };

    let result = null;
    try {
      if (navigator.onLine) {
        result = await workoutService.create(payload);
      } else {
        offlineStorage.queueCompletedWorkout(payload);
        setOfflineCount(offlineStorage.getOfflineQueue().length);
      }
    } catch (err) {
      console.warn('Network error saving workout, queueing offline:', err);
      offlineStorage.queueCompletedWorkout(payload);
      setOfflineCount(offlineStorage.getOfflineQueue().length);
    }

    // Reset local state
    offlineStorage.clearActiveWorkout();
    setActiveWorkout(null);
    setIsActive(false);
    setDuration(0);
    stopRestTimer();

    return result || payload;
  };

  const cancelWorkout = () => {
    offlineStorage.clearActiveWorkout();
    setActiveWorkout(null);
    setIsActive(false);
    setDuration(0);
    stopRestTimer();
  };

  const syncOfflineQueue = async () => {
    const queue = offlineStorage.getOfflineQueue();
    if (!queue || queue.length === 0) return;

    try {
      await workoutService.syncBatch(queue);
      offlineStorage.clearOfflineQueue();
      setOfflineCount(0);
    } catch (err) {
      console.error('Failed to sync offline workouts:', err);
    }
  };

  return (
    <WorkoutTrackingContext.Provider
      value={{
        activeWorkout,
        isActive,
        duration,
        isOnline,
        offlineCount,
        isRestTimerActive,
        restSecondsRemaining,
        restTotalSeconds,
        startWorkout,
        finishWorkout,
        cancelWorkout,
        addExercise,
        removeExercise,
        addSet,
        removeSet,
        updateSet,
        toggleSetCompleted,
        updateWorkoutMeta,
        startRestTimer,
        stopRestTimer,
        addRestTime,
        syncOfflineQueue,
      }}
    >
      {children}
    </WorkoutTrackingContext.Provider>
  );
}

export const useWorkoutTracker = () => {
  const context = useContext(WorkoutTrackingContext);
  if (!context) {
    throw new Error('useWorkoutTracker must be used within a WorkoutTrackingProvider');
  }
  return context;
};

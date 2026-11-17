'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  useTheme,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { routineService } from '../../../services/routineService';
import { workoutService } from '../../../services/workoutService';
import { useWorkoutTracker } from '../../../context/WorkoutTrackingContext';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function SchedulePage() {
  const router = useRouter();
  const theme = useTheme();
  const { startWorkout } = useWorkoutTracker();

  const [routines, setRoutines] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rData, wData] = await Promise.all([
        routineService.getAll(),
        workoutService.getAll(),
      ]);
      setRoutines(rData);
      setWorkouts(wData);
    } catch (err) {
      console.error('Failed to load schedule data', err);
    } finally {
      setLoading(false);
    }
  };

  const primaryRoutine = routines[0] || null;

  const handleStartFromDay = (day) => {
    const initialExercises = day.routine_exercises?.map((rx) => ({
      exercise: rx.exercise_detail || { id: rx.exercise, name: `Exercise #${rx.exercise}` },
      target_sets: rx.target_sets || 3,
      target_reps: rx.target_reps || '10',
      target_weight: rx.target_weight || 0,
      sets_data: rx.sets_data || [],
      target_rpe: rx.target_rpe || 8.0,
      rest_seconds: rx.rest_seconds || 90,
    })) || [];

    startWorkout({
      title: `${primaryRoutine?.name} - ${day.name}`,
      routineDayId: day.id,
      initialExercises,
    });

    router.push('/workouts/active');
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            Training Schedule
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Map out your weekly routine split and stay consistent.
          </Typography>
        </Box>

        {primaryRoutine && (
          <Chip
            icon={<FitnessCenterIcon />}
            label={`Active Plan: ${primaryRoutine.name}`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 700, py: 2 }}
          />
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {DAYS_OF_WEEK.map((dayName, idx) => {
            // Map day index to routine days if available
            const routineDay = primaryRoutine?.days?.[idx] || null;
            const isRestDay = !routineDay;

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={dayName}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: routineDay ? `1px solid ${theme.palette.divider}` : '1px dashed rgba(255,255,255,0.1)',
                    backgroundColor: routineDay
                      ? theme.palette.background.paper
                      : theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.015)'
                      : 'rgba(0,0,0,0.01)',
                  }}
                >
                  <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        {dayName}
                      </Typography>
                      {routineDay ? (
                        <Chip
                          label={`Day ${routineDay.day_number}`}
                          size="small"
                          color="primary"
                          sx={{ fontSize: '0.65rem', height: 20, fontWeight: 700 }}
                        />
                      ) : (
                        <Chip label="Rest Day" size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                      )}
                    </Box>

                    {routineDay ? (
                      <>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: theme.palette.primary.main }}>
                          {routineDay.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                          {routineDay.routine_exercises?.length || 0} programmed exercises
                        </Typography>

                        <Box sx={{ mt: 'auto', pt: 1 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            size="small"
                            startIcon={<PlayArrowIcon />}
                            onClick={() => handleStartFromDay(routineDay)}
                            sx={{ borderRadius: 2, fontWeight: 700 }}
                          >
                            Start Session
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ py: 3, textAlign: 'center', mt: 'auto' }}>
                        <Typography variant="caption" color="text.secondary">
                          Active recovery, mobility, or rest
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Rating,
  Divider,
  Grid,
  CircularProgress,
  IconButton,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TimerIcon from '@mui/icons-material/Timer';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { workoutService } from '../../../../services/workoutService';
import { useAuth } from '../../../../context/AuthContext';
import { formatDuration, calculate1RM } from '../../../../utils/calculations';
import ConfirmDialog from '../../../../components/common/ConfirmDialog';

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuth();

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadWorkout(params.id);
    }
  }, [params.id]);

  const loadWorkout = async (id) => {
    setLoading(true);
    try {
      const data = await workoutService.getById(id);
      setWorkout(data);
    } catch (err) {
      console.error('Failed to load workout', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await workoutService.delete(workout.id);
      router.push('/workouts');
    } catch (err) {
      console.error('Failed to delete workout', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!workout) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6">Workout not found.</Typography>
        <Button component={Link} href="/workouts" sx={{ mt: 2 }}>
          Back to Workouts
        </Button>
      </Box>
    );
  }

  const preferredUnits = user?.profile?.preferred_units || 'kg';

  // Group flat sets by exercise
  const exerciseGroups = {};
  workout.sets?.forEach((s) => {
    const exId = s.exercise;
    if (!exerciseGroups[exId]) {
      exerciseGroups[exId] = {
        exercise: s.exercise_detail || { id: exId, name: `Exercise #${exId}` },
        sets: [],
      };
    }
    exerciseGroups[exId].sets.push(s);
  });

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Button
          component={Link}
          href="/workouts"
          startIcon={<ArrowBackIcon />}
          color="inherit"
          sx={{ borderRadius: 2 }}
        >
          All Workouts
        </Button>

        <IconButton
          color="error"
          onClick={() => setDeleteDialogOpen(true)}
          sx={{ border: `1px solid ${theme.palette.divider}` }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Main Info Card */}
      <Card sx={{ p: 3, mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                {workout.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary', mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarTodayIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2">
                    {new Date(workout.started_at).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TimerIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2">
                    {formatDuration(workout.duration_seconds)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {workout.rating > 0 && (
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Session Rating
                </Typography>
                <Rating value={workout.rating} readOnly size="large" />
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 2.5 }} />

          {/* Quick Metrics */}
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">
                Total Volume
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
                {Math.round(workout.total_volume_kg).toLocaleString()} {preferredUnits}
              </Typography>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">
                Total Reps
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {workout.total_reps}
              </Typography>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">
                Sets Logged
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {workout.sets?.length || 0}
              </Typography>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">
                Exercises
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {Object.keys(exerciseGroups).length}
              </Typography>
            </Grid>
          </Grid>

          {workout.notes && (
            <Box sx={{ mt: 3, p: 2, borderRadius: 2, backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                Notes & Reflection:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {workout.notes}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Exercises Breakdown */}
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Exercise Performance
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {Object.values(exerciseGroups).map((group, idx) => (
          <Card key={idx}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <FitnessCenterIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {group.exercise.name}
                  </Typography>
                </Box>
                <Chip
                  label={group.exercise.primary_muscle_group?.toUpperCase()}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              </Box>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>SET</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>TYPE</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>WEIGHT</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>REPS</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>RPE</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>EST. 1RM</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {group.sets.map((s, sIdx) => {
                      const e1rm = calculate1RM(s.weight_kg, s.reps);
                      return (
                        <TableRow key={sIdx}>
                          <TableCell sx={{ fontWeight: 700 }}>{s.set_number}</TableCell>
                          <TableCell sx={{ textTransform: 'capitalize' }}>{s.set_type}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{s.weight_kg} {preferredUnits}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{s.reps}</TableCell>
                          <TableCell>{s.rpe ? s.rpe : '-'}</TableCell>
                          <TableCell>{e1rm > 0 ? `${e1rm} ${preferredUnits}` : '-'}</TableCell>
                          <TableCell align="center">
                            {s.completed ? (
                              <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                            ) : (
                              <Typography variant="caption" color="text.secondary">Incomplete</Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        ))}
      </Box>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Workout"
        message="Are you sure you want to permanently delete this workout session?"
        confirmText="Delete"
        confirmColor="error"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
}

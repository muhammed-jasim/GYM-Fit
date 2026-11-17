'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Rating,
  Divider,
  useTheme,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TimerIcon from '@mui/icons-material/Timer';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { workoutService } from '../../../services/workoutService';
import { useWorkoutTracker } from '../../../context/WorkoutTrackingContext';
import { useAuth } from '../../../context/AuthContext';
import { formatShortDuration } from '../../../utils/calculations';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

export default function WorkoutsListPage() {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuth();
  const { isActive, startWorkout } = useWorkoutTracker();

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    setLoading(true);
    try {
      const data = await workoutService.getAll();
      setWorkouts(data);
    } catch (err) {
      console.error('Failed to load workouts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNew = () => {
    if (isActive) {
      router.push('/workouts/active');
    } else {
      startWorkout({ title: 'New Workout Session' });
      router.push('/workouts/active');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await workoutService.delete(deleteId);
      setWorkouts((prev) => prev.filter((w) => w.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('Failed to delete workout', err);
    }
  };

  const filteredWorkouts = workouts.filter((w) =>
    w.title.toLowerCase().includes(search.toLowerCase()) ||
    (w.routine_day_name && w.routine_day_name.toLowerCase().includes(search.toLowerCase()))
  );

  const preferredUnits = user?.profile?.preferred_units || 'kg';

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
            Workout History
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review past training sessions, total tonnage, and sets performed.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={isActive ? <PlayArrowIcon /> : <AddIcon />}
          onClick={handleStartNew}
          sx={{ fontWeight: 700, px: 3, py: 1 }}
        >
          {isActive ? 'Resume Active Session' : 'Log New Workout'}
        </Button>
      </Box>

      {/* Filter and Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search by workout title or routine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ maxWidth: 400, width: '100%' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : filteredWorkouts.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <FitnessCenterIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            No workouts found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start logging your sets to track your fitness progression.
          </Typography>
          <Button variant="contained" onClick={handleStartNew}>
            Start First Workout
          </Button>
        </Card>
      ) : (
        <Grid container spacing={2.5}>
          {filteredWorkouts.map((w) => (
            <Grid item xs={12} md={6} key={w.id}>
              <Card
                sx={{
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography
                        component={Link}
                        href={`/workouts/${w.id}`}
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: 'inherit',
                          '&:hover': { color: theme.palette.primary.main },
                        }}
                      >
                        {w.title}
                      </Typography>
                      {w.routine_day_name && (
                        <Chip
                          label={w.routine_day_name}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mt: 0.5, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>

                    <IconButton
                      size="small"
                      color="default"
                      onClick={() => setDeleteId(w.id)}
                      sx={{ color: 'text.secondary', '&:hover': { color: theme.palette.error.main } }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary', my: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarTodayIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">
                        {new Date(w.started_at).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TimerIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">
                        {formatShortDuration(w.duration_seconds)}
                      </Typography>
                    </Box>

                    {w.rating > 0 && (
                      <Rating value={w.rating} readOnly size="small" sx={{ ml: 'auto' }} />
                    )}
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Total Volume
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        {Math.round(w.total_volume_kg).toLocaleString()} {preferredUnits}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Total Reps
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        {w.total_reps}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Sets Logged
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        {w.sets?.length || 0}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      component={Link}
                      href={`/workouts/${w.id}`}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    >
                      View Breakdown
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Workout"
        message="Are you sure you want to delete this workout log? This action cannot be undone."
        confirmText="Delete"
        confirmColor="error"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
}

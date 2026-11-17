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
  Chip,
  Divider,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import TimerIcon from '@mui/icons-material/Timer';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExerciseThumbnail from '../../../../components/workout/ExerciseThumbnail';
import ExerciseGuideModal from '../../../../components/workout/ExerciseGuideModal';
import { routineService } from '../../../../services/routineService';
import { useWorkoutTracker } from '../../../../context/WorkoutTrackingContext';

export default function RoutineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const { startWorkout } = useWorkoutTracker();

  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guideExercise, setGuideExercise] = useState(null);

  useEffect(() => {
    if (params.id) {
      loadRoutine(params.id);
    }
  }, [params.id]);

  const loadRoutine = async (id) => {
    setLoading(true);
    try {
      const data = await routineService.getById(id);
      setRoutine(data);
    } catch (err) {
      console.error('Failed to load routine', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartWorkoutFromDay = (day) => {
    const initialExercises = day.routine_exercises.map((rx) => ({
      exercise: rx.exercise_detail || { id: rx.exercise, name: `Exercise #${rx.exercise}` },
      target_sets: rx.target_sets || 3,
      target_reps: rx.target_reps || '10',
      target_weight: rx.target_weight || 0,
      sets_data: rx.sets_data || [],
      target_rpe: rx.target_rpe || 8.0,
      rest_seconds: rx.rest_seconds || 90,
    }));

    startWorkout({
      title: `${routine.name} - ${day.name}`,
      routineDayId: day.id,
      initialExercises,
    });

    router.push('/workouts/active');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!routine) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6">Routine not found.</Typography>
        <Button component={Link} href="/routines" sx={{ mt: 2 }}>
          Back to Routines
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Button
          component={Link}
          href="/routines"
          startIcon={<ArrowBackIcon />}
          color="inherit"
          sx={{ borderRadius: 2 }}
        >
          All Routines
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {!routine.is_template && (
            <Button
              component={Link}
              href={`/routines/${routine.id}/edit`}
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              sx={{ borderRadius: 2, fontWeight: 700 }}
            >
              Edit Routine
            </Button>
          )}

          {routine.is_template && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<ContentCopyIcon />}
              onClick={async () => {
                const cloned = await routineService.clone(routine.id, `My ${routine.name}`);
                router.push(`/routines/${cloned.id}/edit`);
              }}
              sx={{ borderRadius: 2, fontWeight: 700 }}
            >
              Clone & Customize
            </Button>
          )}
        </Box>
      </Box>

      {/* Routine Info Card */}
      <Card sx={{ p: 3, mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                {routine.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip
                  label={routine.category_display || routine.category}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 700 }}
                />
                <Chip
                  label={`${routine.days_per_week} Days / Week`}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
                {routine.is_template && (
                  <Chip label="Template" size="small" color="secondary" sx={{ fontWeight: 700 }} />
                )}
              </Box>
            </Box>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 800, lineHeight: 1.6 }}>
            {routine.description}
          </Typography>
        </CardContent>
      </Card>

      {/* Days Breakdown */}
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
        Training Days & Exercise Programming
      </Typography>

      <Grid container spacing={3}>
        {routine.days?.map((day) => (
          <Grid item xs={12} md={6} key={day.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ p: 3, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      Day {day.day_number}: {day.name}
                    </Typography>
                    {day.description && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        {day.description}
                      </Typography>
                    )}
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<PlayArrowIcon />}
                    onClick={() => handleStartWorkoutFromDay(day)}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                  >
                    Start Day {day.day_number}
                  </Button>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <List disablePadding>
                  {day.routine_exercises?.map((rx, idx) => {
                    const ex = rx.exercise_detail || { id: rx.exercise, name: `Exercise #${rx.exercise}` };
                    const hasSetsData = Array.isArray(rx.sets_data) && rx.sets_data.length > 0;
                    return (
                      <ListItem
                        key={rx.id || idx}
                        sx={{
                          px: 1.5,
                          py: 1.5,
                          borderRadius: 2,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                          },
                        }}
                        onClick={() => setGuideExercise(ex)}
                      >
                        <Box sx={{ mr: 1.5, mt: 0.5 }}>
                          <ExerciseThumbnail exercise={ex} size={42} />
                        </Box>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                              {ex.name}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 0.3 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>
                                {rx.target_sets} sets × {rx.target_reps} reps
                                {Number(rx.target_weight) > 0 ? ` @ ${rx.target_weight} kg` : ''}
                                {rx.target_rpe ? ` • RPE ${rx.target_rpe}` : ''} • Rest {rx.rest_seconds}s
                              </Typography>

                              {hasSetsData && (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mt: 0.8 }}>
                                  {rx.sets_data.map((s, sIdx) => (
                                    <Chip
                                      key={sIdx}
                                      label={`S${s.set_number || sIdx + 1}: ${Number(s.weight_kg) > 0 ? `${s.weight_kg}kg × ` : ''}${s.reps}`}
                                      size="small"
                                      variant="outlined"
                                      sx={{
                                        fontSize: '0.68rem',
                                        height: 20,
                                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
                                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                      }}
                                    />
                                  ))}
                                </Box>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Exercise Form Guide Modal */}
      {guideExercise && (
        <ExerciseGuideModal
          open={Boolean(guideExercise)}
          onClose={() => setGuideExercise(null)}
          exercise={guideExercise}
        />
      )}
    </Box>
  );
}

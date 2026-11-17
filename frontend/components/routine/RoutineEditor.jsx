'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  IconButton,
  Chip,
  Divider,
  Grid,
  Alert,
  Tooltip,
  Paper,
  InputAdornment,
  CircularProgress,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TimerIcon from '@mui/icons-material/Timer';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import LayersIcon from '@mui/icons-material/Layers';
import ExerciseThumbnail from '../workout/ExerciseThumbnail';
import ExerciseSelector from '../workout/ExerciseSelector';
import ExerciseGuideModal from '../workout/ExerciseGuideModal';
import { routineService } from '../../services/routineService';

const ROUTINE_CATEGORIES = [
  { value: 'ppl', label: 'Push / Pull / Legs (PPL)' },
  { value: 'upper_lower', label: 'Upper / Lower Split' },
  { value: 'full_body', label: 'Full Body' },
  { value: 'bro_split', label: 'Body Part Split / Bro Split' },
  { value: 'custom', label: 'Custom Training Split' },
];

export default function RoutineEditor({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const theme = useTheme();

  // Routine Meta State
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || 'ppl');
  const [daysPerWeek, setDaysPerWeek] = useState(initialData?.days_per_week || 3);

  // Training Days State
  const [days, setDays] = useState(() => {
    if (initialData?.days && initialData.days.length > 0) {
      return initialData.days.map((d, dIdx) => ({
        id: d.id || `day_${Date.now()}_${dIdx}`,
        day_number: d.day_number || dIdx + 1,
        name: d.name || `Day ${dIdx + 1}`,
        description: d.description || '',
        routine_exercises: (d.routine_exercises || []).map((rx, rxIdx) => {
          const exDetail = rx.exercise_detail || { id: rx.exercise, name: `Exercise #${rx.exercise}` };
          const baseWeight = Number(rx.target_weight) || 0;
          const numSets = Number(rx.target_sets) || 3;
          let baseReps = 10;
          if (typeof rx.target_reps === 'number') {
            baseReps = rx.target_reps;
          } else if (typeof rx.target_reps === 'string') {
            const m = rx.target_reps.match(/\d+/);
            if (m) baseReps = parseInt(m[0], 10);
          }

          let setsData = [];
          if (Array.isArray(rx.sets_data) && rx.sets_data.length > 0) {
            setsData = rx.sets_data.map((s, sIdx) => ({
              set_number: s.set_number || sIdx + 1,
              weight_kg: Number(s.weight_kg) || 0,
              reps: Number(s.reps) || baseReps,
            }));
          } else {
            setsData = Array.from({ length: numSets }).map((_, sIdx) => ({
              set_number: sIdx + 1,
              weight_kg: baseWeight,
              reps: baseReps,
            }));
          }

          return {
            exercise_id: exDetail.id,
            exercise_detail: exDetail,
            order: rx.order !== undefined ? rx.order : rxIdx,
            target_sets: numSets,
            target_reps: String(rx.target_reps || '10'),
            target_weight: baseWeight,
            target_rpe: rx.target_rpe || 8.0,
            rest_seconds: rx.rest_seconds || 90,
            notes: rx.notes || '',
            sets_data: setsData,
          };
        }),
      }));
    }

    // Default: 1 empty day
    return [
      {
        id: `day_${Date.now()}_0`,
        day_number: 1,
        name: 'Day 1 - Push Focus',
        description: 'Chest, Shoulders & Triceps',
        routine_exercises: [],
      },
    ];
  });

  const [activeDayTab, setActiveDayTab] = useState(0);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [guideExercise, setGuideExercise] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // --------------------------------------------------------------------------
  // Day Operations
  // --------------------------------------------------------------------------
  const handleAddDay = () => {
    const nextNum = days.length + 1;
    const newDay = {
      id: `day_${Date.now()}_${nextNum}`,
      day_number: nextNum,
      name: `Day ${nextNum}`,
      description: '',
      routine_exercises: [],
    };
    setDays((prev) => [...prev, newDay]);
    setActiveDayTab(days.length);
  };

  const handleRemoveDay = (dayIndex) => {
    if (days.length <= 1) {
      setErrorMsg('A routine must contain at least 1 training day.');
      return;
    }
    const updated = days
      .filter((_, idx) => idx !== dayIndex)
      .map((d, idx) => ({ ...d, day_number: idx + 1 }));
    setDays(updated);
    if (activeDayTab >= updated.length) {
      setActiveDayTab(Math.max(0, updated.length - 1));
    }
  };

  const handleUpdateDayField = (field, value) => {
    setDays((prev) =>
      prev.map((d, idx) => (idx === activeDayTab ? { ...d, [field]: value } : d))
    );
  };

  // --------------------------------------------------------------------------
  // Exercise Operations for Active Day
  // --------------------------------------------------------------------------
  const handleAddExerciseToActiveDay = (exercise) => {
    setDays((prev) => {
      return prev.map((day, dIdx) => {
        if (dIdx !== activeDayTab) return day;

        // Default exercise starting parameters
        const defaultWeight = 20.0;
        const defaultReps = 10;
        const defaultSets = 3;

        const newRx = {
          exercise_id: exercise.id,
          exercise_detail: exercise,
          order: day.routine_exercises.length,
          target_sets: defaultSets,
          target_reps: '10',
          target_weight: defaultWeight,
          target_rpe: 8.0,
          rest_seconds: 90,
          notes: '',
          sets_data: Array.from({ length: defaultSets }).map((_, sIdx) => ({
            set_number: sIdx + 1,
            weight_kg: defaultWeight,
            reps: defaultReps,
          })),
        };

        return {
          ...day,
          routine_exercises: [...day.routine_exercises, newRx],
        };
      });
    });

    setSelectorOpen(false);
  };

  const handleRemoveExercise = (exIndex) => {
    setDays((prev) =>
      prev.map((day, dIdx) => {
        if (dIdx !== activeDayTab) return day;
        const updatedExercises = day.routine_exercises
          .filter((_, idx) => idx !== exIndex)
          .map((rx, idx) => ({ ...rx, order: idx }));
        return { ...day, routine_exercises: updatedExercises };
      })
    );
  };

  const handleMoveExercise = (exIndex, direction) => {
    setDays((prev) =>
      prev.map((day, dIdx) => {
        if (dIdx !== activeDayTab) return day;
        const exercises = [...day.routine_exercises];
        const targetIdx = exIndex + direction;
        if (targetIdx < 0 || targetIdx >= exercises.length) return day;

        const temp = exercises[exIndex];
        exercises[exIndex] = exercises[targetIdx];
        exercises[targetIdx] = temp;

        return {
          ...day,
          routine_exercises: exercises.map((rx, idx) => ({ ...rx, order: idx })),
        };
      })
    );
  };

  // --------------------------------------------------------------------------
  // Exercise & Set Configuration
  // --------------------------------------------------------------------------
  const handleUpdateExerciseField = (exIndex, field, value) => {
    setDays((prev) =>
      prev.map((day, dIdx) => {
        if (dIdx !== activeDayTab) return day;
        const updated = [...day.routine_exercises];
        const currentRx = { ...updated[exIndex], [field]: value };

        // If target_sets changed, adjust sets_data length
        if (field === 'target_sets') {
          const newSetCount = Math.max(1, parseInt(value, 10) || 1);
          currentRx.target_sets = newSetCount;
          const currentSets = currentRx.sets_data || [];
          if (newSetCount > currentSets.length) {
            const lastWeight = currentRx.target_weight || 0;
            const lastReps = parseInt(currentRx.target_reps, 10) || 10;
            const extra = Array.from({ length: newSetCount - currentSets.length }).map(
              (_, i) => ({
                set_number: currentSets.length + i + 1,
                weight_kg: lastWeight,
                reps: lastReps,
              })
            );
            currentRx.sets_data = [...currentSets, ...extra];
          } else {
            currentRx.sets_data = currentSets.slice(0, newSetCount);
          }
        }

        updated[exIndex] = currentRx;
        return { ...day, routine_exercises: updated };
      })
    );
  };

  // Update specific set weight or reps
  const handleUpdateSet = (exIndex, setIndex, field, value) => {
    setDays((prev) =>
      prev.map((day, dIdx) => {
        if (dIdx !== activeDayTab) return day;
        const updated = [...day.routine_exercises];
        const currentRx = { ...updated[exIndex] };
        const sets = [...(currentRx.sets_data || [])];

        const numVal = Math.max(0, parseFloat(value) || 0);
        sets[setIndex] = {
          ...sets[setIndex],
          [field]: numVal,
        };
        currentRx.sets_data = sets;

        // If updating set 0, optionally sync base target
        if (setIndex === 0) {
          if (field === 'weight_kg') currentRx.target_weight = numVal;
          if (field === 'reps') currentRx.target_reps = String(numVal);
        }

        updated[exIndex] = currentRx;
        return { ...day, routine_exercises: updated };
      })
    );
  };

  // Micro-increment weight on a specific set
  const handleDeltaSetWeight = (exIndex, setIndex, delta) => {
    setDays((prev) =>
      prev.map((day, dIdx) => {
        if (dIdx !== activeDayTab) return day;
        const updated = [...day.routine_exercises];
        const currentRx = { ...updated[exIndex] };
        const sets = [...(currentRx.sets_data || [])];
        const currentW = sets[setIndex]?.weight_kg || 0;
        const nextW = Math.max(0, Math.round((currentW + delta) * 100) / 100);

        sets[setIndex] = { ...sets[setIndex], weight_kg: nextW };
        currentRx.sets_data = sets;
        if (setIndex === 0) currentRx.target_weight = nextW;

        updated[exIndex] = currentRx;
        return { ...day, routine_exercises: updated };
      })
    );
  };

  // Sync first set's weight & reps across all sets of the exercise
  const handleSyncSetToAll = (exIndex) => {
    setDays((prev) =>
      prev.map((day, dIdx) => {
        if (dIdx !== activeDayTab) return day;
        const updated = [...day.routine_exercises];
        const currentRx = { ...updated[exIndex] };
        const firstSet = currentRx.sets_data[0] || { weight_kg: currentRx.target_weight || 0, reps: 10 };

        currentRx.sets_data = currentRx.sets_data.map((s) => ({
          ...s,
          weight_kg: firstSet.weight_kg,
          reps: firstSet.reps,
        }));
        currentRx.target_weight = firstSet.weight_kg;
        currentRx.target_reps = String(firstSet.reps);

        updated[exIndex] = currentRx;
        return { ...day, routine_exercises: updated };
      })
    );
  };

  // Add an extra set to an exercise
  const handleAddSetToExercise = (exIndex) => {
    setDays((prev) =>
      prev.map((day, dIdx) => {
        if (dIdx !== activeDayTab) return day;
        const updated = [...day.routine_exercises];
        const currentRx = { ...updated[exIndex] };
        const sets = [...(currentRx.sets_data || [])];
        const lastSet = sets[sets.length - 1] || { weight_kg: currentRx.target_weight || 0, reps: 10 };

        sets.push({
          set_number: sets.length + 1,
          weight_kg: lastSet.weight_kg,
          reps: lastSet.reps,
        });

        currentRx.sets_data = sets;
        currentRx.target_sets = sets.length;
        updated[exIndex] = currentRx;
        return { ...day, routine_exercises: updated };
      })
    );
  };

  // Delete a set from an exercise
  const handleDeleteSetFromExercise = (exIndex, setIndex) => {
    setDays((prev) =>
      prev.map((day, dIdx) => {
        if (dIdx !== activeDayTab) return day;
        const updated = [...day.routine_exercises];
        const currentRx = { ...updated[exIndex] };
        let sets = (currentRx.sets_data || []).filter((_, idx) => idx !== setIndex);
        if (sets.length === 0) {
          sets = [{ set_number: 1, weight_kg: 0, reps: 10 }];
        } else {
          sets = sets.map((s, idx) => ({ ...s, set_number: idx + 1 }));
        }

        currentRx.sets_data = sets;
        currentRx.target_sets = sets.length;
        updated[exIndex] = currentRx;
        return { ...day, routine_exercises: updated };
      })
    );
  };

  // --------------------------------------------------------------------------
  // Save / Submit Routine
  // --------------------------------------------------------------------------
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter a routine title.');
      return;
    }

    // Validate days
    if (days.length === 0) {
      setErrorMsg('Please configure at least one training day.');
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      category,
      days_per_week: Number(daysPerWeek) || days.length,
      days: days.map((day, dIdx) => ({
        day_number: dIdx + 1,
        name: day.name.trim() || `Day ${dIdx + 1}`,
        description: day.description.trim(),
        routine_exercises: day.routine_exercises.map((rx, rxIdx) => ({
          exercise: rx.exercise_id,
          order: rxIdx,
          target_sets: Number(rx.target_sets) || (rx.sets_data?.length || 3),
          target_reps: String(rx.target_reps || '10'),
          target_weight: Number(rx.target_weight) || (rx.sets_data?.[0]?.weight_kg || 0),
          sets_data: rx.sets_data || [],
          target_rpe: Number(rx.target_rpe) || 8.0,
          rest_seconds: Number(rx.rest_seconds) || 90,
          notes: rx.notes || '',
        })),
      })),
    };

    setSaving(true);
    try {
      let result;
      if (isEdit && initialData?.id) {
        result = await routineService.update(initialData.id, payload);
      } else {
        result = await routineService.create(payload);
      }
      router.push(`/routines/${result.id}`);
    } catch (err) {
      console.error('Failed to save routine:', err);
      const detail = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      setErrorMsg(`Failed to save routine: ${detail}`);
    } finally {
      setSaving(false);
    }
  };

  const activeDay = days[activeDayTab] || days[0];

  return (
    <Box sx={{ pb: 10, maxWidth: 1000, mx: 'auto' }}>
      {/* Top Header & Actions */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            component={Link}
            href={isEdit && initialData?.id ? `/routines/${initialData.id}` : '/routines'}
            startIcon={<ArrowBackIcon />}
            color="inherit"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {isEdit ? 'Edit Training Routine' : 'Create Custom Routine'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Set exercises, target weights (kg), reps, and set progression.
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={saving}
          sx={{ fontWeight: 700, px: 3, minWidth: 140, borderRadius: 2 }}
        >
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Routine'}
        </Button>
      </Box>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {errorMsg}
        </Alert>
      )}

      {/* Routine Metadata Card */}
      <Card sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarMonthIcon color="primary" /> Routine Overview
        </Typography>

        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Routine Title"
              placeholder="e.g. 4-Day Push / Pull Strength & Hypertrophy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              size="medium"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="medium">
              <InputLabel id="category-select-label">Split Type</InputLabel>
              <Select
                labelId="category-select-label"
                label="Split Type"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {ROUTINE_CATEGORIES.map((c) => (
                  <MenuItem key={c.value} value={c.value}>
                    {c.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              label="Days Per Week"
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(Math.max(1, Math.min(7, parseInt(e.target.value, 10) || 1)))}
              inputProps={{ min: 1, max: 7 }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Description & Focus"
              placeholder="Optional notes, progression strategy, or split schedule..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              size="small"
            />
          </Grid>
        </Grid>
      </Card>

      {/* Training Days Tabs Header */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
          <LayersIcon color="primary" /> Programmed Training Days ({days.length})
        </Typography>

        <Button
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAddDay}
          sx={{ borderRadius: 2, fontWeight: 700 }}
        >
          Add Another Day
        </Button>
      </Box>

      {/* Days Tabs */}
      <Tabs
        value={activeDayTab}
        onChange={(e, val) => setActiveDayTab(val)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 3,
          borderBottom: `1px solid ${theme.palette.divider}`,
          '& .MuiTab-root': { fontWeight: 700, minHeight: 48 },
        }}
      >
        {days.map((d, idx) => (
          <Tab
            key={d.id || idx}
            label={d.name || `Day ${idx + 1}`}
            iconPosition="start"
          />
        ))}
      </Tabs>

      {/* Active Day Detail Card */}
      {activeDay && (
        <Card sx={{ p: 3, mb: 4, borderRadius: 3, border: `1.5px solid ${theme.palette.primary.main}22` }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
              mb: 2.5,
            }}
          >
            <Box sx={{ display: 'flex', gap: 1.5, flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                label="Day Name"
                value={activeDay.name}
                onChange={(e) => handleUpdateDayField('name', e.target.value)}
                size="small"
                sx={{ flexGrow: 1, maxWidth: { sm: 300 } }}
              />
              <TextField
                label="Focus / Muscle Target"
                placeholder="e.g. Chest & Triceps"
                value={activeDay.description}
                onChange={(e) => handleUpdateDayField('description', e.target.value)}
                size="small"
                sx={{ flexGrow: 2 }}
              />
            </Box>

            {days.length > 1 && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteOutlineIcon />}
                onClick={() => handleRemoveDay(activeDayTab)}
                sx={{ borderRadius: 2 }}
              >
                Delete Day
              </Button>
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Exercises in This Day */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Exercises in {activeDay.name || `Day ${activeDayTab + 1}`} ({activeDay.routine_exercises?.length || 0})
            </Typography>

            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setSelectorOpen(true)}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Add Exercise
            </Button>
          </Box>

          {/* Empty Exercises State */}
          {(!activeDay.routine_exercises || activeDay.routine_exercises.length === 0) && (
            <Paper
              variant="outlined"
              sx={{
                p: 5,
                textAlign: 'center',
                borderRadius: 3,
                borderStyle: 'dashed',
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
              }}
            >
              <FitnessCenterIcon sx={{ fontSize: 44, color: 'text.secondary', mb: 1.5, opacity: 0.7 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                No exercises added yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                Add movements to this day and set your target weight (kg) and rep targets for each set.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setSelectorOpen(true)}
                sx={{ fontWeight: 700, borderRadius: 2 }}
              >
                Choose Exercise from 3D Library
              </Button>
            </Paper>
          )}

          {/* Exercise Cards List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {activeDay.routine_exercises?.map((rx, exIdx) => {
              const ex = rx.exercise_detail || { name: 'Exercise', primary_muscle_group: 'chest' };

              return (
                <Card
                  key={rx.exercise_id || exIdx}
                  variant="outlined"
                  sx={{
                    borderRadius: 2.5,
                    overflow: 'hidden',
                    borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                    {/* Header: Thumbnail, Name, Reorder, Remove */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
                        onClick={() => setGuideExercise(ex)}
                      >
                        <ExerciseThumbnail exercise={ex} size={48} />
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                            {ex.name}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center', mt: 0.2 }}>
                            <Chip
                              label={ex.primary_muscle_display || ex.primary_muscle_group || 'Target'}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                              }}
                            />
                            {ex.equipment && (
                              <Typography variant="caption" color="text.secondary">
                                • {ex.equipment}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>

                      {/* Controls: Up, Down, Delete */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          disabled={exIdx === 0}
                          onClick={() => handleMoveExercise(exIdx, -1)}
                        >
                          <ArrowUpwardIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          disabled={exIdx === activeDay.routine_exercises.length - 1}
                          onClick={() => handleMoveExercise(exIdx, 1)}
                        >
                          <ArrowDownwardIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveExercise(exIdx)}
                          title="Remove Exercise"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Quick Base Controls: Sets, Rest Timer, Notes */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6} sm={3}>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          label="Total Sets"
                          value={rx.target_sets || rx.sets_data?.length || 3}
                          onChange={(e) => handleUpdateExerciseField(exIdx, 'target_sets', e.target.value)}
                          inputProps={{ min: 1, max: 10 }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel id={`rest-label-${exIdx}`}>Rest Timer</InputLabel>
                          <Select
                            labelId={`rest-label-${exIdx}`}
                            label="Rest Timer"
                            value={rx.rest_seconds || 90}
                            onChange={(e) => handleUpdateExerciseField(exIdx, 'rest_seconds', e.target.value)}
                          >
                            <MenuItem value={45}>45 seconds</MenuItem>
                            <MenuItem value={60}>60 seconds</MenuItem>
                            <MenuItem value={90}>90 seconds (Standard)</MenuItem>
                            <MenuItem value={120}>2 minutes (Strength)</MenuItem>
                            <MenuItem value={180}>3 minutes (Heavy Compound)</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Notes / Coaching Cues"
                          placeholder="e.g. Pause 1s at bottom, explosive concentric..."
                          value={rx.notes || ''}
                          onChange={(e) => handleUpdateExerciseField(exIdx, 'notes', e.target.value)}
                        />
                      </Grid>
                    </Grid>

                    {/* Set-by-Set Programming Section (The Core Feature!) */}
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Set-by-Set Weight & Reps Programming
                        </Typography>

                        {rx.sets_data?.length > 1 && (
                          <Button
                            size="small"
                            variant="text"
                            color="primary"
                            startIcon={<SyncAltIcon fontSize="inherit" />}
                            onClick={() => handleSyncSetToAll(exIdx)}
                            sx={{ fontSize: '0.72rem', py: 0.2 }}
                          >
                            Sync Set 1 to All Sets
                          </Button>
                        )}
                      </Box>

                      {/* Sets Table / Steppers */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {rx.sets_data?.map((set, sIdx) => (
                          <Box
                            key={set.set_number || sIdx}
                            sx={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 1.5,
                              p: 1,
                              borderRadius: 1.5,
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.25)' : '#ffffff',
                              border: `1px solid ${theme.palette.divider}`,
                            }}
                          >
                            {/* Set Number Badge */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 60 }}>
                              <Chip
                                label={`Set ${sIdx + 1}`}
                                size="small"
                                sx={{ fontWeight: 800, height: 24, fontSize: '0.72rem' }}
                              />
                            </Box>

                            {/* Weight Input + Micro-steppers */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, maxWidth: { sm: 300 } }}>
                              <TextField
                                size="small"
                                type="number"
                                label="Weight"
                                value={set.weight_kg}
                                onChange={(e) => handleUpdateSet(exIdx, sIdx, 'weight_kg', e.target.value)}
                                InputProps={{
                                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                                }}
                                sx={{ width: 110 }}
                              />

                              {/* Micro-loading buttons (+1.25, +2.5, +5) */}
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <Chip
                                  label="+1.25"
                                  size="small"
                                  clickable
                                  onClick={() => handleDeltaSetWeight(exIdx, sIdx, 1.25)}
                                  sx={{ height: 24, fontSize: '0.68rem', fontWeight: 700 }}
                                />
                                <Chip
                                  label="+2.5"
                                  size="small"
                                  clickable
                                  onClick={() => handleDeltaSetWeight(exIdx, sIdx, 2.5)}
                                  sx={{ height: 24, fontSize: '0.68rem', fontWeight: 700 }}
                                />
                                <Chip
                                  label="+5"
                                  size="small"
                                  clickable
                                  onClick={() => handleDeltaSetWeight(exIdx, sIdx, 5)}
                                  sx={{ height: 24, fontSize: '0.68rem', fontWeight: 700 }}
                                />
                              </Box>
                            </Box>

                            {/* Reps Input + Quick Selectors */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 150 }}>
                              <TextField
                                size="small"
                                type="number"
                                label="Reps"
                                value={set.reps}
                                onChange={(e) => handleUpdateSet(exIdx, sIdx, 'reps', e.target.value)}
                                InputProps={{
                                  endAdornment: <InputAdornment position="end">reps</InputAdornment>,
                                }}
                                sx={{ width: 105 }}
                              />

                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                {[8, 10, 12].map((r) => (
                                  <Chip
                                    key={r}
                                    label={r}
                                    size="small"
                                    clickable
                                    color={set.reps === r ? 'primary' : 'default'}
                                    onClick={() => handleUpdateSet(exIdx, sIdx, 'reps', r)}
                                    sx={{ height: 24, minWidth: 26, fontSize: '0.68rem', fontWeight: 700 }}
                                  />
                                ))}
                              </Box>
                            </Box>

                            {/* Delete Set */}
                            <IconButton
                              size="small"
                              color="default"
                              onClick={() => handleDeleteSetFromExercise(exIdx, sIdx)}
                              disabled={rx.sets_data.length <= 1}
                              title="Delete Set"
                            >
                              <DeleteOutlineIcon fontSize="inherit" />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>

                      {/* Add Set Button */}
                      <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'flex-start' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => handleAddSetToExercise(exIdx)}
                          sx={{ borderRadius: 1.5, fontWeight: 700, fontSize: '0.75rem' }}
                        >
                          Add Set {rx.sets_data?.length + 1}
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Card>
      )}

      {/* Sticky Bottom Bar for Mobile Save */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(15, 23, 22, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 100,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
        }}
      >
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {name || 'New Routine'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {days.length} Days • {days.reduce((acc, d) => acc + (d.routine_exercises?.length || 0), 0)} Total Exercises
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            component={Link}
            href={isEdit && initialData?.id ? `/routines/${initialData.id}` : '/routines'}
            variant="outlined"
            color="inherit"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving}
            sx={{ fontWeight: 700, px: 3, borderRadius: 2 }}
          >
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Save Routine'}
          </Button>
        </Box>
      </Box>

      {/* 3D Exercise Selector Modal */}
      {selectorOpen && (
        <ExerciseSelector
          open={selectorOpen}
          onClose={() => setSelectorOpen(false)}
          onSelectExercise={handleAddExerciseToActiveDay}
        />
      )}

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

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
  TextField,
  IconButton,
  Checkbox,
  Select,
  MenuItem,
  Chip,
  Paper,
  Rating,
  Divider,
  Grid,
  Collapse,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import StopIcon from '@mui/icons-material/Stop';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CalculateIcon from '@mui/icons-material/Calculate';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import confetti from 'canvas-confetti';
import { useWorkoutTracker } from '../../../../context/WorkoutTrackingContext';
import { useAuth } from '../../../../context/AuthContext';
import { workoutService } from '../../../../services/workoutService';
import { formatDuration, calculate1RM } from '../../../../utils/calculations';
import PlateCalculator from '../../../../components/workout/PlateCalculator';
import ExerciseSelector from '../../../../components/workout/ExerciseSelector';
import ExerciseThumbnail from '../../../../components/workout/ExerciseThumbnail';
import ExerciseGuideModal from '../../../../components/workout/ExerciseGuideModal';
import MobileSetCard from '../../../../components/workout/MobileSetCard';
import ConfirmDialog from '../../../../components/common/ConfirmDialog';

export default function ActiveWorkoutPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const {
    activeWorkout,
    isActive,
    duration,
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
    isRestTimerActive,
    restSecondsRemaining,
    addRestTime,
  } = useWorkoutTracker();

  const [plateCalcOpen, setPlateCalcOpen] = useState(false);
  const [exerciseSelectorOpen, setExerciseSelectorOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [selectedCalcWeight, setSelectedCalcWeight] = useState(60);
  const [guideExercise, setGuideExercise] = useState(null);

  // Progressive Overload & Previous Performance Cache
  const [previousPerformance, setPreviousPerformance] = useState({});
  const [expandedHistory, setExpandedHistory] = useState({});

  const preferredUnits = user?.profile?.preferred_units || 'kg';

  // If no active workout, prompt to create or redirect
  useEffect(() => {
    if (!isActive && !activeWorkout) {
      startWorkout({ title: 'Live Workout' });
    }
  }, [isActive, activeWorkout, startWorkout]);

  // Fetch previous performance for exercises in the workout
  const fetchPreviousPerformance = useCallback(async () => {
    if (!activeWorkout?.exercises || activeWorkout.exercises.length === 0) return;

    const ids = activeWorkout.exercises
      .map((exGroup) => exGroup.exercise?.id)
      .filter((id) => Boolean(id) && !previousPerformance[id]);

    if (ids.length === 0) return;

    try {
      const data = await workoutService.getPreviousPerformance(ids);
      if (data) {
        setPreviousPerformance((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.warn('Failed to fetch previous workout performance:', err);
    }
  }, [activeWorkout?.exercises, previousPerformance]);

  useEffect(() => {
    fetchPreviousPerformance();
  }, [fetchPreviousPerformance]);

  const toggleHistoryExpand = (exId) => {
    setExpandedHistory((prev) => ({
      ...prev,
      [exId]: !prev[exId],
    }));
  };

  if (!activeWorkout) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Initializing workout session...
        </Typography>
      </Box>
    );
  }

  // Live total volume and sets count
  let liveVolume = 0;
  let completedSetsCount = 0;
  let totalSetsCount = 0;

  activeWorkout.exercises?.forEach((ex) => {
    ex.sets?.forEach((s) => {
      totalSetsCount++;
      if (s.completed) {
        completedSetsCount++;
        liveVolume += (parseFloat(s.weight_kg) || 0) * (parseInt(s.reps, 10) || 0);
      }
    });
  });

  const handleFinish = async () => {
    setIsFinishing(true);
    try {
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#288474', '#f59e0b', '#10b981', '#ffffff'],
        });
      } catch (e) {
        // Fallback if confetti canvas is not loaded
      }

      const res = await finishWorkout();
      if (res?.id) {
        router.push(`/workouts/${res.id}`);
      } else {
        router.push('/workouts');
      }
    } catch (err) {
      console.error('Error finishing workout', err);
    } finally {
      setIsFinishing(false);
    }
  };

  const openPlateCalculatorFor = (weight) => {
    setSelectedCalcWeight(parseFloat(weight) || 60);
    setPlateCalcOpen(true);
  };

  // Helper to adjust set weight with micro-increments
  const handleMicroAdjust = (exIndex, setIndex, currentVal, delta) => {
    const num = parseFloat(currentVal) || 0;
    const next = Math.max(0, Math.round((num + delta) * 100) / 100);
    updateSet(exIndex, setIndex, 'weight_kg', next);
  };

  return (
    <Box sx={{ pb: { xs: 22, md: 8 } }}>
      {/* Sticky Top Control Header */}
      <Paper
        elevation={3}
        sx={{
          position: 'sticky',
          top: 64,
          zIndex: 100,
          p: 2,
          mb: 3,
          borderRadius: 3,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(19, 27, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'center' },
            gap: 2,
          }}
        >
          {/* Title & Elapsed Timer */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                backgroundColor: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                flexShrink: 0,
              }}
            >
              <FitnessCenterIcon />
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <TextField
                variant="standard"
                value={activeWorkout.title}
                onChange={(e) => updateWorkoutMeta({ title: e.target.value })}
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: { xs: '1.1rem', sm: '1.35rem' }, fontWeight: 800 },
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PlayCircleFilledIcon
                  sx={{ color: theme.palette.success.main, fontSize: 16 }}
                  className="pulse-recording"
                />
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: theme.palette.text.secondary }}
                >
                  {formatDuration(duration)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Quick Metrics Ribbon */}
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', px: { md: 2 } }}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Volume Moved
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
                {Math.round(liveVolume).toLocaleString()} {preferredUnits}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Sets Done
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                {completedSetsCount} / {totalSetsCount}
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<CalculateIcon />}
              onClick={() => setPlateCalcOpen(true)}
              sx={{ borderRadius: 2 }}
            >
              Plates
            </Button>

            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => setCancelDialogOpen(true)}
              sx={{ borderRadius: 2 }}
            >
              Discard
            </Button>

            <Button
              variant="contained"
              color="primary"
              size="medium"
              disabled={isFinishing}
              startIcon={<StopIcon />}
              onClick={handleFinish}
              sx={{
                fontWeight: 700,
                borderRadius: 2,
                px: 2.5,
                boxShadow: '0 4px 14px rgba(40, 132, 116, 0.4)',
              }}
            >
              {isFinishing ? 'Saving...' : 'Finish Workout'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Exercises Section */}
      {activeWorkout.exercises?.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center', mb: 3 }}>
          <FitnessCenterIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            No exercises added yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add exercises from the library to begin logging your sets and tracking weight progression.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setExerciseSelectorOpen(true)}
          >
            Add Exercise
          </Button>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
          {activeWorkout.exercises.map((exGroup, exIndex) => {
            const exId = exGroup.exercise?.id;
            const prevData = previousPerformance[exId] || previousPerformance[String(exId)];
            const isHistoryOpen = Boolean(expandedHistory[exId]);

            return (
              <Card
                key={exIndex}
                sx={{
                  overflow: 'hidden',
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                  {/* Exercise Header matching user reference */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1.5,
                    }}
                  >
                    {/* Left: Thumbnail Avatar & Title */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
                      <Tooltip title="Click to view Animated Form Guide & Target Muscles">
                        <Box
                          onClick={() => setGuideExercise(exGroup.exercise)}
                          sx={{ cursor: 'pointer' }}
                        >
                          <ExerciseThumbnail exercise={exGroup.exercise} size={46} active />
                        </Box>
                      </Tooltip>

                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 800,
                              fontSize: { xs: '1rem', sm: '1.2rem' },
                              cursor: 'pointer',
                              '&:hover': { color: theme.palette.primary.main },
                            }}
                            onClick={() => setGuideExercise(exGroup.exercise)}
                          >
                            {exGroup.exercise?.name}
                          </Typography>

                          <IconButton
                            size="small"
                            title="Exercise Guide & Anatomy"
                            onClick={() => setGuideExercise(exGroup.exercise)}
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            <InfoOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.4 }}>
                          <Chip
                            label={exGroup.exercise?.primary_muscle_group?.toUpperCase()}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontSize: '0.65rem', height: 20, fontWeight: 700 }}
                          />
                          <Chip
                            label={exGroup.exercise?.equipment}
                            size="small"
                            sx={{ fontSize: '0.65rem', height: 20 }}
                          />
                        </Box>
                      </Box>
                    </Box>

                    {/* Right Action Icons */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        title="Calculate Plates"
                        onClick={() => openPlateCalculatorFor(exGroup.sets[0]?.weight_kg)}
                      >
                        <CalculateIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeExercise(exIndex)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Progressive Overload Advisor Banner */}
                  {prevData?.has_history && (
                    <Box
                      sx={{
                        p: 1.5,
                        mb: 2,
                        borderRadius: 2,
                        backgroundColor:
                          theme.palette.mode === 'dark' ? 'rgba(40, 132, 116, 0.08)' : 'rgba(40, 132, 116, 0.05)',
                        border: '1px solid rgba(40, 132, 116, 0.25)',
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUpIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.primary.main, display: 'block' }}>
                            ⚡ Progressive Overload Target:
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {prevData.overload_recommendation?.message} (Last: {prevData.last_date})
                          </Typography>
                        </Box>
                      </Box>

                      {prevData.history?.length > 0 && (
                        <Button
                          size="small"
                          variant="text"
                          startIcon={<HistoryIcon sx={{ fontSize: '16px !important' }} />}
                          endIcon={isHistoryOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          onClick={() => toggleHistoryExpand(exId)}
                          sx={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: theme.palette.primary.main,
                            textTransform: 'none',
                            p: 0.5,
                          }}
                        >
                          {isHistoryOpen ? 'Hide History' : 'View Progression Log'}
                        </Button>
                      )}
                    </Box>
                  )}

                  {/* Expandable Historical Progression Logs */}
                  <Collapse in={isHistoryOpen}>
                    <Box
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        backgroundColor: theme.palette.mode === 'dark' ? '#0f1722' : '#f8fafc',
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HistoryIcon fontSize="small" color="primary" />
                        Previous Sessions & Weight Progression:
                      </Typography>

                      <Grid container spacing={1.5}>
                        {prevData?.history?.map((session, sIdx) => (
                          <Grid item xs={12} sm={6} md={4} key={sIdx}>
                            <Paper
                              variant="outlined"
                              sx={{
                                p: 1.2,
                                borderRadius: 1.5,
                                backgroundColor: theme.palette.background.paper,
                              }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                  {session.date}
                                </Typography>
                                <Typography variant="caption" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
                                  Max: {session.max_weight} {preferredUnits}
                                </Typography>
                              </Box>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Sets: {session.sets.map((s) => `${s.weight_kg}kg×${s.reps}`).join(', ')}
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Collapse>

                  {/* Responsive Set Logger: Mobile Cards vs Desktop Table */}
                  {isMobile ? (
                    /* Mobile-First Touch-Optimized Cards */
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {exGroup.sets.map((s, sIndex) => {
                        const prevSet = prevData?.sets?.find(
                          (ps) => ps.set_number === s.set_number
                        ) || prevData?.sets?.[sIndex] || null;

                        return (
                          <MobileSetCard
                            key={sIndex}
                            set={s}
                            setIndex={sIndex}
                            exerciseIndex={exIndex}
                            previousSet={prevSet}
                            preferredUnits={preferredUnits}
                            canRemove={exGroup.sets.length > 1}
                            onUpdateSet={(field, val) => updateSet(exIndex, sIndex, field, val)}
                            onToggleCompleted={() => toggleSetCompleted(exIndex, sIndex)}
                            onRemoveSet={() => removeSet(exIndex, sIndex)}
                          />
                        );
                      })}
                    </Box>
                  ) : (
                    /* Desktop Streamlined Table */
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, width: 50 }}>SET</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: 100 }}>TYPE</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: 120 }}>PREVIOUS</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: 140 }}>
                              WEIGHT ({preferredUnits})
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, width: 90 }}>REPS</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: 80 }}>RPE</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: 90 }}>1RM EST.</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, width: 70 }}>
                              DONE
                            </TableCell>
                            <TableCell sx={{ width: 40 }} />
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {exGroup.sets.map((s, sIndex) => {
                            const estimated1rm = calculate1RM(s.weight_kg, s.reps);
                            const prevSet = prevData?.sets?.find(
                              (ps) => ps.set_number === s.set_number
                            ) || prevData?.sets?.[sIndex] || null;

                            return (
                              <TableRow
                                key={sIndex}
                                sx={{
                                  backgroundColor: s.completed
                                    ? theme.palette.mode === 'dark'
                                      ? 'rgba(40, 132, 116, 0.12)'
                                      : 'rgba(40, 132, 116, 0.08)'
                                    : 'inherit',
                                }}
                              >
                                <TableCell sx={{ fontWeight: 700 }}>
                                  {s.set_number}
                                </TableCell>

                                {/* Set Type */}
                                <TableCell>
                                  <Select
                                    value={s.set_type}
                                    size="small"
                                    onChange={(e) =>
                                      updateSet(exIndex, sIndex, 'set_type', e.target.value)
                                    }
                                    sx={{ fontSize: '0.8rem', height: 32 }}
                                  >
                                    <MenuItem value="normal">Normal</MenuItem>
                                    <MenuItem value="warmup">Warmup</MenuItem>
                                    <MenuItem value="drop">Drop</MenuItem>
                                    <MenuItem value="failure">Failure</MenuItem>
                                  </Select>
                                </TableCell>

                                {/* Previous Session Pill */}
                                <TableCell>
                                  {prevSet ? (
                                    <Chip
                                      label={`${prevSet.weight_kg}kg × ${prevSet.reps}`}
                                      size="small"
                                      clickable
                                      onClick={() => {
                                        updateSet(exIndex, sIndex, 'weight_kg', prevSet.weight_kg);
                                        updateSet(exIndex, sIndex, 'reps', prevSet.reps);
                                      }}
                                      title="Click to copy previous session weight and reps"
                                      sx={{
                                        fontSize: '0.72rem',
                                        height: 24,
                                        fontWeight: 600,
                                        backgroundColor: 'rgba(24, 144, 255, 0.1)',
                                        color: '#1890ff',
                                      }}
                                    />
                                  ) : (
                                    <Typography variant="caption" color="text.secondary">
                                      -
                                    </Typography>
                                  )}
                                </TableCell>

                                {/* Weight + Micro-Overload Buttons */}
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <TextField
                                      type="number"
                                      size="small"
                                      value={s.weight_kg}
                                      onChange={(e) =>
                                        updateSet(exIndex, sIndex, 'weight_kg', e.target.value)
                                      }
                                      inputProps={{ min: 0, step: 2.5 }}
                                      sx={{ width: 80 }}
                                    />
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => handleMicroAdjust(exIndex, sIndex, s.weight_kg, 1.25)}
                                        sx={{
                                          fontSize: '0.62rem',
                                          py: 0,
                                          px: 0.5,
                                          minWidth: 32,
                                          height: 16,
                                          lineHeight: 1,
                                        }}
                                      >
                                        +1.25
                                      </Button>
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => handleMicroAdjust(exIndex, sIndex, s.weight_kg, 2.5)}
                                        sx={{
                                          fontSize: '0.62rem',
                                          py: 0,
                                          px: 0.5,
                                          minWidth: 32,
                                          height: 16,
                                          lineHeight: 1,
                                        }}
                                      >
                                        +2.5
                                      </Button>
                                    </Box>
                                  </Box>
                                </TableCell>

                                {/* Reps */}
                                <TableCell>
                                  <TextField
                                    type="number"
                                    size="small"
                                    value={s.reps}
                                    onChange={(e) =>
                                      updateSet(exIndex, sIndex, 'reps', e.target.value)
                                    }
                                    inputProps={{ min: 0, step: 1 }}
                                    sx={{ width: 70 }}
                                  />
                                </TableCell>

                                {/* RPE */}
                                <TableCell>
                                  <TextField
                                    type="number"
                                    size="small"
                                    placeholder="8.0"
                                    value={s.rpe || ''}
                                    onChange={(e) =>
                                      updateSet(exIndex, sIndex, 'rpe', e.target.value)
                                    }
                                    inputProps={{ min: 1, max: 10, step: 0.5 }}
                                    sx={{ width: 65 }}
                                  />
                                </TableCell>

                                {/* 1RM Est */}
                                <TableCell>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                                    {estimated1rm > 0 ? `${estimated1rm} ${preferredUnits}` : '-'}
                                  </Typography>
                                </TableCell>

                                {/* Done Checkbox */}
                                <TableCell align="center">
                                  <Checkbox
                                    checked={s.completed}
                                    icon={<RadioButtonUncheckedIcon />}
                                    checkedIcon={<CheckCircleIcon sx={{ color: theme.palette.success.main }} />}
                                    onChange={() => toggleSetCompleted(exIndex, sIndex)}
                                  />
                                </TableCell>

                                {/* Remove Set */}
                                <TableCell>
                                  <IconButton
                                    size="small"
                                    onClick={() => removeSet(exIndex, sIndex)}
                                    disabled={exGroup.sets.length <= 1}
                                  >
                                    <CloseIcon fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  {/* Add Set & Rest Timer shortcuts */}
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => addSet(exIndex)}
                      sx={{ borderRadius: 2 }}
                    >
                      Add Set
                    </Button>
                    <Button
                      size="small"
                      variant="text"
                      startIcon={<TimerIcon />}
                      onClick={() => startRestTimer(90)}
                      sx={{ borderRadius: 2 }}
                    >
                      Rest 90s
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Add Exercise & Workout Meta Notes */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setExerciseSelectorOpen(true)}
          sx={{ py: 1.2, px: 4, fontWeight: 700, borderRadius: 2.5 }}
        >
          Add Exercise to Workout
        </Button>
      </Box>

      {/* Workout Notes and Session Rating */}
      <Card sx={{ p: 2, mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Session Notes & Reflection
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Workout Notes & Reflection"
                fullWidth
                multiline
                rows={2}
                placeholder="How did today's session feel? Form notes, fatigue, energy levels..."
                value={activeWorkout.notes || ''}
                onChange={(e) => updateWorkoutMeta({ notes: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Session Rating
                </Typography>
                <Rating
                  size="large"
                  value={activeWorkout.rating || 5}
                  onChange={(e, val) => updateWorkoutMeta({ rating: val || 5 })}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Mobile Floating Sticky Footer Bar */}
      {isMobile && (
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            bottom: 60,
            left: 0,
            right: 0,
            zIndex: 999,
            p: 1.5,
            px: 2,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(15, 23, 34, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            borderTop: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              {formatDuration(duration)} • {Math.round(liveVolume)} {preferredUnits}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
              {completedSetsCount}/{totalSetsCount} Sets
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {isRestTimerActive && (
              <Chip
                color="warning"
                size="small"
                label={`Rest: ${restSecondsRemaining}s`}
                onClick={() => addRestTime(30)}
                title="Tap to add +30s"
                sx={{ fontWeight: 700 }}
              />
            )}

            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<StopIcon />}
              onClick={handleFinish}
              disabled={isFinishing}
              sx={{ fontWeight: 800, borderRadius: 2, px: 2 }}
            >
              Finish
            </Button>
          </Box>
        </Paper>
      )}

      {/* Modals & Dialogs */}
      <ExerciseSelector
        open={exerciseSelectorOpen}
        onClose={() => setExerciseSelectorOpen(false)}
        onSelectExercise={(ex) => addExercise(ex)}
      />

      <PlateCalculator
        open={plateCalcOpen}
        onClose={() => setPlateCalcOpen(false)}
        initialWeight={selectedCalcWeight}
        unit={preferredUnits}
      />

      {/* Exercise Animation & Form Guide Modal (matching user reference screenshot) */}
      {guideExercise && (
        <ExerciseGuideModal
          open={Boolean(guideExercise)}
          onClose={() => setGuideExercise(null)}
          exercise={guideExercise}
        />
      )}

      <ConfirmDialog
        open={cancelDialogOpen}
        title="Discard Workout?"
        message="Are you sure you want to discard this workout? Any sets you've logged in this session will be permanently erased."
        confirmText="Discard"
        confirmColor="error"
        onConfirm={() => {
          setCancelDialogOpen(false);
          cancelWorkout();
          router.push('/workouts');
        }}
        onCancel={() => setCancelDialogOpen(false)}
      />
    </Box>
  );
}

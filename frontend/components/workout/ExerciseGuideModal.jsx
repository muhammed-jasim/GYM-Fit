'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Box,
  Typography,
  IconButton,
  Chip,
  LinearProgress,
  Divider,
  Button,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AirIcon from '@mui/icons-material/Air';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ExerciseAnimation from './ExerciseAnimation';
import { getExerciseGuide } from '../../utils/exerciseGuides';

export default function ExerciseGuideModal({
  open,
  onClose,
  exercise,
  onAddToWorkout = null,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);

  if (!exercise) return null;

  // Retrieve coaching guide details
  const guide = getExerciseGuide(exercise.slug || exercise.id || exercise.name);

  const title = exercise.name || guide?.name || 'Exercise Details';
  const equipment = exercise.equipment_display || exercise.equipment || guide?.equipment || 'Barbell';
  const primaryMuscle = exercise.primary_muscle_display || exercise.primary_muscle_group || guide?.primaryMuscle || 'Chest';
  const secondaryMuscles = guide?.secondaryMuscles || ['Triceps', 'Shoulders'];
  const muscleActivation = guide?.muscleActivation;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 3 },
          backgroundColor: theme.palette.mode === 'dark' ? '#111822' : '#ffffff',
          backgroundImage: 'none',
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: { xs: '100vh', sm: '90vh' },
        },
      }}
    >
      {/* Dialog Header matching Hevy Reference */}
      <DialogTitle
        component="div"
        sx={{
          m: 0,
          px: { xs: 2, sm: 3 },
          pt: 2.5,
          pb: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" component="h2" sx={{ fontWeight: 800, fontSize: { xs: '1.15rem', sm: '1.3rem' } }}>
          {title}
        </Typography>

        <IconButton
          aria-label="close"
          onClick={onClose}
          size="small"
          sx={{
            color: (theme) => theme.palette.grey[500],
            '&:hover': { color: theme.palette.text.primary },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Tabs matching Reference Screenshot */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: { xs: 2, sm: 3 } }}>
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            minHeight: 44,
            '& .MuiTab-root': {
              minHeight: 44,
              fontWeight: 700,
              fontSize: '0.95rem',
              textTransform: 'none',
              px: 2.5,
            },
          }}
        >
          <Tab label="Summary" />
          <Tab label="How to" />
        </Tabs>
      </Box>

      {/* Dialog Content */}
      <DialogContent sx={{ p: { xs: 2, sm: 3 }, overflowY: 'auto' }}>
        {/* Tab 0: Summary */}
        {activeTab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* 1. Animated Visual Viewport */}
            <ExerciseAnimation
              slug={exercise?.slug}
              exerciseName={title}
              animationType={guide?.animationType || 'bench_press'}
              primaryMuscle={primaryMuscle}
              equipment={equipment}
              height={isMobile ? 240 : 280}
            />

            {/* 2. Key Attributes (Matching Reference) */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2.5,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Equipment
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {equipment}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Primary Muscle
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#ff4d4f' }}>
                    {primaryMuscle}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Movement Pattern
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {guide?.movementPattern || 'Compound Movement'}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Difficulty
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                    {guide?.difficulty || 'Intermediate'}
                  </Typography>
                </Grid>
              </Grid>

              {/* Secondary Muscles Chips */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Secondary Muscles Involved:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {secondaryMuscles.map((sec, idx) => (
                    <Chip
                      key={idx}
                      label={sec}
                      size="small"
                      sx={{ fontSize: '0.72rem', height: 22 }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>

            {/* 3. Muscle Recruitment Breakdown */}
            {muscleActivation && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                  Target Muscle Recruitment
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                  {Object.entries(muscleActivation).map(([key, item]) => (
                    <Box key={key}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: item.color }}>
                          {item.percent}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={item.percent}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: item.color,
                            borderRadius: 3,
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* 4. Progressive Overload Tip */}
            {guide?.overloadProtocol && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  backgroundColor: 'rgba(40, 132, 116, 0.08)',
                  border: '1px solid rgba(40, 132, 116, 0.25)',
                  display: 'flex',
                  gap: 1.5,
                  alignItems: 'flex-start',
                }}
              >
                <TrendingUpIcon sx={{ color: theme.palette.primary.main, mt: 0.2 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                    Progressive Overload Strategy
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {guide.overloadProtocol}
                  </Typography>
                </Box>
              </Paper>
            )}

            {/* 5. Personal Records & Recent Performance (if available) */}
            {exercise?.personal_records?.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Your Records
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {exercise.personal_records.map((pr, idx) => (
                    <Chip
                      key={idx}
                      label={`${pr.record_type === 'max_weight' ? 'Max Weight' : 'Est 1RM'}: ${pr.value} kg`}
                      color="secondary"
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {exercise?.recent_history?.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Recent Completed Sets
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                  {exercise.recent_history.slice(0, 4).map((h, i) => (
                    <Paper
                      key={i}
                      variant="outlined"
                      sx={{
                        p: 1,
                        px: 1.5,
                        borderRadius: 1.5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {h.weight_kg} kg × {h.reps} reps
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(h.date).toLocaleDateString()}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* Tab 1: How to */}
        {activeTab === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Step-by-Step Instructions */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
                Step-by-Step Execution
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {guide?.setup?.map((item) => (
                  <Box key={item.step} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.primary.main,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        flexShrink: 0,
                        mt: 0.2,
                      }}
                    >
                      {item.step}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3, lineHeight: 1.5 }}>
                        {item.text}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Divider />

            {/* Breathing Guide */}
            {guide?.breathing && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <AirIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    Breathing Technique
                  </Typography>
                </Box>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                      Inhale:
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {guide.breathing.inhale}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#ff4d4f' }}>
                      Exhale:
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {guide.breathing.exhale}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}

            {/* Common Mistakes & Fixes */}
            {guide?.commonMistakes && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <WarningAmberIcon sx={{ color: '#fa8c16' }} fontSize="small" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    Common Mistakes to Avoid
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {guide.commonMistakes.map((m, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        p: 1.8,
                        borderRadius: 2,
                        backgroundColor: 'rgba(250, 140, 22, 0.08)',
                        border: '1px solid rgba(250, 140, 22, 0.25)',
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#fa8c16' }}>
                        ✕ {m.mistake}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.82rem' }}>
                        <span style={{ fontWeight: 600, color: theme.palette.text.primary }}>Fix: </span>
                        {m.fix}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Pro Coach Tip */}
            {guide?.proCue && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  backgroundColor: 'rgba(24, 144, 255, 0.08)',
                  border: '1px solid rgba(24, 144, 255, 0.25)',
                  display: 'flex',
                  gap: 1.5,
                }}
              >
                <LightbulbOutlinedIcon sx={{ color: '#1890ff', mt: 0.2 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1890ff' }}>
                    Pro Form Cue
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                    {guide.proCue}
                  </Typography>
                </Box>
              </Paper>
            )}
          </Box>
        )}
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions sx={{ p: 2, px: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Close
        </Button>
        {onAddToWorkout && (
          <Button
            onClick={() => {
              onAddToWorkout(exercise);
              onClose();
            }}
            variant="contained"
            color="primary"
            startIcon={<FitnessCenterIcon />}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Add to Workout
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

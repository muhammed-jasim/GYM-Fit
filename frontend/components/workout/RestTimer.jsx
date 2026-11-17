'use client';

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  LinearProgress,
  useTheme,
} from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useWorkoutTracker } from '../../context/WorkoutTrackingContext';

export default function RestTimer() {
  const theme = useTheme();
  const {
    isRestTimerActive,
    restSecondsRemaining,
    restTotalSeconds,
    stopRestTimer,
    addRestTime,
  } = useWorkoutTracker();

  if (!isRestTimerActive) return null;

  const progress = restTotalSeconds > 0
    ? ((restTotalSeconds - restSecondsRemaining) / restTotalSeconds) * 100
    : 0;

  const minutes = Math.floor(restSecondsRemaining / 60);
  const seconds = restSecondsRemaining % 60;
  const timeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <Paper
      elevation={6}
      sx={{
        position: 'fixed',
        bottom: { xs: 125, md: 30 },
        right: { xs: 16, sm: 30 },
        zIndex: 1200,
        width: { xs: 'calc(100% - 32px)', sm: 320 },
        maxWidth: 340,
        p: 2,
        borderRadius: 3,
        backgroundColor: theme.palette.mode === 'dark' ? '#18232e' : '#ffffff',
        border: `1px solid ${theme.palette.primary.main}`,
        boxShadow: '0 8px 32px rgba(40, 132, 116, 0.3)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimerIcon color="primary" />
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Rest Timer
          </Typography>
        </Box>
        <IconButton size="small" onClick={stopRestTimer} sx={{ p: 0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Typography
        variant="h3"
        align="center"
        sx={{
          fontWeight: 800,
          fontVariantNumeric: 'tabular-nums',
          color: restSecondsRemaining <= 10 ? theme.palette.error.main : theme.palette.primary.main,
          my: 1,
          transition: 'color 0.3s ease, transform 0.2s ease',
          animation: restSecondsRemaining <= 5 ? 'urgentPulse 0.8s infinite ease-in-out' : 'none',
          '@keyframes urgentPulse': {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.08)' },
          },
        }}
      >
        {timeFormatted}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: theme.palette.primary.main,
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          mb: 1.5,
        }}
      />

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => addRestTime(30)}
          sx={{ borderRadius: 2 }}
        >
          +30s
        </Button>
        <Button
          size="small"
          variant="text"
          color="inherit"
          onClick={stopRestTimer}
          sx={{ borderRadius: 2 }}
        >
          Skip Rest
        </Button>
      </Box>
    </Paper>
  );
}

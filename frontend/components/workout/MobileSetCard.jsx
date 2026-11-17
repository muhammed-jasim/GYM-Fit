'use client';

import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Select,
  MenuItem,
  Chip,
  Paper,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { calculate1RM } from '../../utils/calculations';

/**
 * MobileSetCard: A thumb-friendly, touch-optimized card for logging workout sets on mobile screens (<600px).
 * Eliminates cramped table scrolling and offers 1-tap progressive overload (+1.25kg, +2.5kg).
 */
export default function MobileSetCard({
  set,
  setIndex,
  exerciseIndex,
  previousSet,
  preferredUnits = 'kg',
  onUpdateSet,
  onToggleCompleted,
  onRemoveSet,
  canRemove = true,
}) {
  const theme = useTheme();

  const currentWeight = parseFloat(set.weight_kg) || 0;
  const currentReps = parseInt(set.reps, 10) || 0;
  const estimated1rm = calculate1RM(currentWeight, currentReps);

  // Stepper handlers
  const handleWeightChange = (delta) => {
    const next = Math.max(0, Math.round((currentWeight + delta) * 100) / 100);
    onUpdateSet('weight_kg', next);
  };

  const handleRepsChange = (delta) => {
    const next = Math.max(0, currentReps + delta);
    onUpdateSet('reps', next);
  };

  // Copy previous session's weight and reps
  const handleCopyPrevious = () => {
    if (previousSet) {
      onUpdateSet('weight_kg', previousSet.weight_kg);
      onUpdateSet('reps', previousSet.reps);
    }
  };

  return (
    <Paper
      elevation={set.completed ? 1 : 2}
      sx={{
        p: 2,
        borderRadius: 2.5,
        border: `1.5px solid ${
          set.completed
            ? theme.palette.primary.main
            : theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.08)'
        }`,
        backgroundColor: set.completed
          ? theme.palette.mode === 'dark'
            ? 'rgba(40, 132, 116, 0.14)'
            : 'rgba(40, 132, 116, 0.07)'
          : theme.palette.background.paper,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: set.completed ? 'successPop 0.35s ease' : 'none',
        '@keyframes successPop': {
          '0%': { transform: 'scale(0.99)' },
          '50%': { transform: 'scale(1.015)', boxShadow: '0 0 16px rgba(40, 132, 116, 0.3)' },
          '100%': { transform: 'scale(1)' },
        },
        '@keyframes checkmarkBounce': {
          '0%': { transform: 'scale(0.5)' },
          '60%': { transform: 'scale(1.25)' },
          '100%': { transform: 'scale(1)' },
        },
      }}
    >
      {/* Top Header: Set Number, Set Type, Previous Pill, Delete Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              backgroundColor: set.completed ? theme.palette.primary.main : theme.palette.action.selected,
              color: set.completed ? '#fff' : theme.palette.text.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.8rem',
            }}
          >
            {set.set_number}
          </Box>

          <Select
            value={set.set_type}
            size="small"
            onChange={(e) => onUpdateSet('set_type', e.target.value)}
            sx={{
              fontSize: '0.78rem',
              height: 28,
              '& .MuiSelect-select': { py: 0.5, px: 1 },
            }}
          >
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="warmup">Warmup</MenuItem>
            <MenuItem value="drop">Drop Set</MenuItem>
            <MenuItem value="failure">Failure</MenuItem>
          </Select>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Previous Performance Pill */}
          {previousSet && (
            <Chip
              icon={<HistoryIcon sx={{ fontSize: '14px !important' }} />}
              label={`Prev: ${previousSet.weight_kg}${preferredUnits} × ${previousSet.reps}`}
              size="small"
              onClick={handleCopyPrevious}
              title="Click to copy previous session weight and reps"
              sx={{
                fontSize: '0.7rem',
                height: 24,
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: 'rgba(24, 144, 255, 0.12)',
                color: '#1890ff',
                border: '1px solid rgba(24, 144, 255, 0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(24, 144, 255, 0.25)',
                },
              }}
            />
          )}

          {canRemove && (
            <IconButton size="small" color="default" onClick={onRemoveSet} sx={{ p: 0.5 }}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Main Touch Inputs: Weight Stepper & Reps Stepper */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 1.5 }}>
        {/* Weight Stepper */}
        <Box
          sx={{
            p: 1.2,
            borderRadius: 2,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mb: 0.5 }}>
            WEIGHT ({preferredUnits})
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <IconButton
              size="small"
              onClick={() => handleWeightChange(-2.5)}
              sx={{
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                width: 34,
                height: 34,
              }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontVariantNumeric: 'tabular-nums',
                color: theme.palette.primary.main,
              }}
            >
              {currentWeight}
            </Typography>

            <IconButton
              size="small"
              onClick={() => handleWeightChange(2.5)}
              sx={{
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                width: 34,
                height: 34,
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Micro-Overload Buttons */}
          <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleWeightChange(1.25)}
              sx={{
                py: 0.2,
                px: 0.8,
                minWidth: 'auto',
                fontSize: '0.68rem',
                fontWeight: 700,
                borderRadius: 1.5,
              }}
            >
              +1.25
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleWeightChange(2.5)}
              sx={{
                py: 0.2,
                px: 0.8,
                minWidth: 'auto',
                fontSize: '0.68rem',
                fontWeight: 700,
                borderRadius: 1.5,
              }}
            >
              +2.5
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleWeightChange(5)}
              sx={{
                py: 0.2,
                px: 0.8,
                minWidth: 'auto',
                fontSize: '0.68rem',
                fontWeight: 700,
                borderRadius: 1.5,
              }}
            >
              +5
            </Button>
          </Box>
        </Box>

        {/* Reps Stepper */}
        <Box
          sx={{
            p: 1.2,
            borderRadius: 2,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mb: 0.5 }}>
            REPS
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <IconButton
              size="small"
              onClick={() => handleRepsChange(-1)}
              sx={{
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                width: 34,
                height: 34,
              }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {currentReps}
            </Typography>

            <IconButton
              size="small"
              onClick={() => handleRepsChange(1)}
              sx={{
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                width: 34,
                height: 34,
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Quick Rep Targets */}
          <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
            {[5, 8, 10, 12].map((r) => (
              <Button
                key={r}
                size="small"
                variant={currentReps === r ? 'contained' : 'outlined'}
                color={currentReps === r ? 'primary' : 'inherit'}
                onClick={() => onUpdateSet('reps', r)}
                sx={{
                  py: 0.2,
                  px: 0.6,
                  minWidth: 'auto',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  borderRadius: 1.5,
                }}
              >
                {r}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Bottom Sub-Row: 1RM Calc & Large Touch Log Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            1RM: <strong>{estimated1rm > 0 ? `${estimated1rm} ${preferredUnits}` : '-'}</strong>
          </Typography>
        </Box>

        {/* Big Complete Button */}
        <Button
          fullWidth
          variant={set.completed ? 'contained' : 'outlined'}
          color={set.completed ? 'success' : 'primary'}
          onClick={onToggleCompleted}
          startIcon={
            set.completed ? (
              <CheckCircleIcon sx={{ animation: 'checkmarkBounce 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }} />
            ) : (
              <RadioButtonUncheckedIcon />
            )
          }
          sx={{
            maxWidth: 180,
            py: 0.8,
            borderRadius: 2,
            fontWeight: 800,
            fontSize: '0.85rem',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: set.completed ? 'scale(1.02)' : 'scale(1)',
            '&:active': { transform: 'scale(0.95)' },
            boxShadow: set.completed ? '0 4px 16px rgba(16, 185, 129, 0.35)' : 'none',
          }}
        >
          {set.completed ? 'COMPLETED' : 'LOG SET'}
        </Button>
      </Box>
    </Paper>
  );
}

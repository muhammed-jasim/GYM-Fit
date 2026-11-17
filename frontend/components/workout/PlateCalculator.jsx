'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Divider,
  useTheme,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { calculateBarbellPlates } from '../../utils/calculations';

const PLATE_COLORS = {
  25: '#dc2626', // Red
  20: '#2563eb', // Blue
  15: '#eab308', // Yellow
  10: '#16a34a', // Green
  5: '#f97316',  // Orange
  2.5: '#9333ea', // Purple
  1.25: '#6b7280', // Grey
  45: '#2563eb', // Blue (lbs)
  35: '#eab308', // Yellow (lbs)
};

export default function PlateCalculator({ open, onClose, initialWeight = 100, unit = 'kg' }) {
  const theme = useTheme();
  const [targetWeight, setTargetWeight] = useState(initialWeight || 100);
  const [selectedUnit, setSelectedUnit] = useState(unit || 'kg');

  const calculation = calculateBarbellPlates(targetWeight, selectedUnit);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FitnessCenterIcon color="primary" />
        <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
          Barbell Plate Calculator
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
          <TextField
            label="Target Total Weight"
            type="number"
            value={targetWeight}
            onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
            fullWidth
            InputProps={{
              endAdornment: <Typography variant="body2" color="text.secondary">{selectedUnit}</Typography>,
            }}
          />
          <ToggleButtonGroup
            value={selectedUnit}
            exclusive
            onChange={(e, val) => val && setSelectedUnit(val)}
            size="small"
          >
            <ToggleButton value="kg">KG</ToggleButton>
            <ToggleButton value="lbs">LBS</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ p: 2, borderRadius: 2, backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Standard Barbell: <strong>{calculation.barbellWeight} {selectedUnit}</strong>
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
            Load Per Side: {calculation.perSideWeight} {selectedUnit}
          </Typography>
        </Box>

        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
          Plates Needed On Each Side:
        </Typography>

        {calculation.platesPerSide.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', py: 2 }}>
            No plates required (weight is equal to or less than the empty barbell).
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {calculation.platesPerSide.map((p, idx) => (
              <Chip
                key={idx}
                label={`${p} ${selectedUnit}`}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  backgroundColor: PLATE_COLORS[p] || theme.palette.primary.main,
                  color: '#ffffff',
                }}
              />
            ))}
          </Box>
        )}

        {/* Visual Barbell Representation */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Visual Loading Rack (Inside ➔ Collar):
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 3,
            backgroundColor: theme.palette.mode === 'dark' ? '#0c1116' : '#f1f5f9',
            borderRadius: 2,
            overflowX: 'auto',
          }}
        >
          {/* Bar Shaft */}
          <Box sx={{ width: 40, height: 10, backgroundColor: '#94a3b8', borderRadius: 1 }} />
          {/* Inner Collar */}
          <Box sx={{ width: 14, height: 36, backgroundColor: '#64748b', borderRadius: 1 }} />
          {/* Loaded Plates */}
          {calculation.platesPerSide.map((p, idx) => {
            const height = Math.min(80, Math.max(34, p * 2.8));
            return (
              <Box
                key={idx}
                sx={{
                  width: 14,
                  height: height,
                  mx: 0.5,
                  borderRadius: '3px',
                  backgroundColor: PLATE_COLORS[p] || '#334155',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              />
            );
          })}
          {/* Outer Sleeve */}
          <Box sx={{ width: 30, height: 12, backgroundColor: '#94a3b8', borderRadius: 1 }} />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

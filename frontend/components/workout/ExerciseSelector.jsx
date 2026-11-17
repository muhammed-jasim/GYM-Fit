'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Chip,
  Box,
  Button,
  IconButton,
  CircularProgress,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { exerciseService } from '../../services/exerciseService';
import { MUSCLE_GROUPS } from '../../utils/constants';
import ExerciseThumbnail from './ExerciseThumbnail';
import ExerciseGuideModal from './ExerciseGuideModal';

export default function ExerciseSelector({ open, onClose, onSelectExercise }) {
  const theme = useTheme();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [guideExercise, setGuideExercise] = useState(null);

  useEffect(() => {
    if (open) {
      loadExercises();
    }
  }, [open]);

  const loadExercises = async () => {
    setLoading(true);
    try {
      const data = await exerciseService.getAll();
      setExercises(data);
    } catch (err) {
      console.error('Failed to load exercises', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.primary_muscle_group.toLowerCase().includes(search.toLowerCase()) ||
      ex.equipment.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle =
      selectedMuscle === 'all' || ex.primary_muscle_group === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FitnessCenterIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Select Exercise
            </Typography>
          </Box>
          <Chip label={`${filteredExercises.length} found`} size="small" />
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          <Box sx={{ p: 2, pb: 1 }}>
            <TextField
              fullWidth
              placeholder="Search exercise, muscle, or equipment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Filter chips */}
          <Box sx={{ px: 2, pb: 1.5, display: 'flex', gap: 0.8, overflowX: 'auto' }}>
            <Chip
              label="All Muscles"
              size="small"
              clickable
              color={selectedMuscle === 'all' ? 'primary' : 'default'}
              onClick={() => setSelectedMuscle('all')}
            />
            {MUSCLE_GROUPS.map((m) => (
              <Chip
                key={m.value}
                label={m.label}
                size="small"
                clickable
                color={selectedMuscle === m.value ? 'primary' : 'default'}
                onClick={() => setSelectedMuscle(m.value)}
              />
            ))}
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress size={32} color="primary" />
            </Box>
          ) : filteredExercises.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
              <Typography variant="body1" color="text.secondary">
                No exercises match your filter.
              </Typography>
            </Box>
          ) : (
            <List sx={{ pt: 0, maxHeight: 420, overflowY: 'auto' }}>
              {filteredExercises.map((ex) => (
                <ListItem
                  key={ex.id}
                  disablePadding
                  divider
                  secondaryAction={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        title="View Exercise Guide & Animation"
                        onClick={(e) => {
                          e.stopPropagation();
                          setGuideExercise(ex);
                        }}
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        <InfoOutlinedIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        color="primary"
                        title="Add to Workout"
                        onClick={() => {
                          onSelectExercise(ex);
                          onClose();
                        }}
                      >
                        <AddCircleIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemButton
                    onClick={() => {
                      onSelectExercise(ex);
                      onClose();
                    }}
                    sx={{ py: 1.2, px: 2, display: 'flex', alignItems: 'center', gap: 1.5, pr: 10 }}
                  >
                    <ExerciseThumbnail exercise={ex} size={42} />

                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {ex.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {ex.primary_muscle_group?.toUpperCase()} • {ex.equipment}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Guide Modal Triggered from List */}
      {guideExercise && (
        <ExerciseGuideModal
          open={Boolean(guideExercise)}
          onClose={() => setGuideExercise(null)}
          exercise={guideExercise}
          onAddToWorkout={(ex) => {
            onSelectExercise(ex);
            setGuideExercise(null);
            onClose();
          }}
        />
      )}
    </>
  );
}

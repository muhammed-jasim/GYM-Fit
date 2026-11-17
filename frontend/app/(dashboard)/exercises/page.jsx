'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AddIcon from '@mui/icons-material/Add';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HistoryIcon from '@mui/icons-material/History';
import ExerciseThumbnail from '../../../components/workout/ExerciseThumbnail';
import ExerciseGuideModal from '../../../components/workout/ExerciseGuideModal';
import { exerciseService } from '../../../services/exerciseService';
import { MUSCLE_GROUPS, EQUIPMENT_OPTIONS, DIFFICULTY_OPTIONS } from '../../../utils/constants';

export default function ExercisesPage() {
  const theme = useTheme();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState('all');

  // Detail Modal
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Create Custom Exercise Modal
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    primary_muscle_group: 'chest',
    secondary_muscles: '',
    equipment: 'barbell',
    category: 'hypertrophy',
    difficulty: 'intermediate',
    instructions: '',
    tips: '',
  });

  useEffect(() => {
    loadExercises();
  }, []);

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

  const handleOpenDetail = async (ex) => {
    setSelectedExercise(ex);
    setDetailLoading(true);
    try {
      const fullDetail = await exerciseService.getById(ex.id);
      setSelectedExercise(fullDetail);
    } catch (err) {
      console.error('Failed to load exercise detail', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const newEx = await exerciseService.create(createForm);
      setExercises((prev) => [newEx, ...prev]);
      setCreateOpen(false);
      setCreateForm({
        name: '',
        primary_muscle_group: 'chest',
        secondary_muscles: '',
        equipment: 'barbell',
        category: 'hypertrophy',
        difficulty: 'intermediate',
        instructions: '',
        tips: '',
      });
    } catch (err) {
      console.error('Failed to create custom exercise', err);
    }
  };

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.instructions?.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle =
      selectedMuscle === 'all' || ex.primary_muscle_group === selectedMuscle;
    const matchesEquipment =
      selectedEquipment === 'all' || ex.equipment === selectedEquipment;
    return matchesSearch && matchesMuscle && matchesEquipment;
  });

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
            Exercise Library
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore movements, technique cues, target muscle groups, and your PR history.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
          sx={{ fontWeight: 700, px: 3 }}
        >
          Add Custom Exercise
        </Button>
      </Box>

      {/* Filters & Search */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
        <TextField
          placeholder="Search exercise..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 260 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Equipment</InputLabel>
          <Select
            value={selectedEquipment}
            label="Equipment"
            onChange={(e) => setSelectedEquipment(e.target.value)}
          >
            <MenuItem value="all">All Equipment</MenuItem>
            {EQUIPMENT_OPTIONS.map((eq) => (
              <MenuItem key={eq.value} value={eq.value}>
                {eq.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Muscle Group Tabs / Filter Chips */}
      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 2, mb: 3 }}>
        <Chip
          label="All Muscles"
          clickable
          color={selectedMuscle === 'all' ? 'primary' : 'default'}
          onClick={() => setSelectedMuscle('all')}
          sx={{ fontWeight: 600 }}
        />
        {MUSCLE_GROUPS.map((m) => (
          <Chip
            key={m.value}
            label={m.label}
            clickable
            color={selectedMuscle === m.value ? 'primary' : 'default'}
            onClick={() => setSelectedMuscle(m.value)}
            sx={{ fontWeight: 600 }}
          />
        ))}
      </Box>

      {/* Exercises Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : filteredExercises.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <FitnessCenterIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            No exercises match your filter
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search terms or create a custom exercise.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={2.5}>
          {filteredExercises.map((ex) => (
            <Grid item xs={12} sm={6} md={4} key={ex.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleOpenDetail(ex)}
                  sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <ExerciseThumbnail exercise={ex} size={42} />
                      <Chip
                        label={ex.primary_muscle_group?.toUpperCase()}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontSize: '0.65rem', fontWeight: 700 }}
                      />
                    </Box>
                    <Chip
                      label={ex.difficulty}
                      size="small"
                      sx={{
                        fontSize: '0.65rem',
                        textTransform: 'capitalize',
                        backgroundColor:
                          ex.difficulty === 'beginner'
                            ? 'rgba(16, 185, 129, 0.15)'
                            : ex.difficulty === 'intermediate'
                            ? 'rgba(59, 130, 246, 0.15)'
                            : 'rgba(239, 68, 68, 0.15)',
                      }}
                    />
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {ex.name}
                  </Typography>

                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
                    Equipment: <strong>{ex.equipment}</strong> • {ex.category}
                  </Typography>

                  {ex.instructions && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.5,
                      }}
                    >
                      {ex.instructions}
                    </Typography>
                  )}
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Exercise Detail Modal with Animations & Form Guide */}
      <ExerciseGuideModal
        open={Boolean(selectedExercise)}
        onClose={() => setSelectedExercise(null)}
        exercise={selectedExercise}
      />

      {/* Create Custom Exercise Modal */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create Custom Exercise</DialogTitle>
        <Box component="form" onSubmit={handleCreateSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Exercise Name"
                  fullWidth
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Primary Muscle</InputLabel>
                  <Select
                    value={createForm.primary_muscle_group}
                    label="Primary Muscle"
                    onChange={(e) => setCreateForm({ ...createForm, primary_muscle_group: e.target.value })}
                  >
                    {MUSCLE_GROUPS.map((m) => (
                      <MenuItem key={m.value} value={m.value}>
                        {m.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Equipment</InputLabel>
                  <Select
                    value={createForm.equipment}
                    label="Equipment"
                    onChange={(e) => setCreateForm({ ...createForm, equipment: e.target.value })}
                  >
                    {EQUIPMENT_OPTIONS.map((eq) => (
                      <MenuItem key={eq.value} value={eq.value}>
                        {eq.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={createForm.difficulty}
                    label="Difficulty"
                    onChange={(e) => setCreateForm({ ...createForm, difficulty: e.target.value })}
                  >
                    {DIFFICULTY_OPTIONS.map((d) => (
                      <MenuItem key={d.value} value={d.value}>
                        {d.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Secondary Muscles"
                  fullWidth
                  size="small"
                  placeholder="e.g. Triceps, Front Delts"
                  value={createForm.secondary_muscles}
                  onChange={(e) => setCreateForm({ ...createForm, secondary_muscles: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Technique Instructions"
                  fullWidth
                  multiline
                  rows={3}
                  value={createForm.instructions}
                  onChange={(e) => setCreateForm({ ...createForm, instructions: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Pro Tips & Form Cues"
                  fullWidth
                  multiline
                  rows={2}
                  value={createForm.tips}
                  onChange={(e) => setCreateForm({ ...createForm, tips: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setCreateOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save Exercise
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { routineService } from '../../../services/routineService';
import { useWorkoutTracker } from '../../../context/WorkoutTrackingContext';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

export default function RoutinesPage() {
  const router = useRouter();
  const theme = useTheme();
  const { startWorkout } = useWorkoutTracker();

  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0); // 0: All, 1: Templates, 2: Custom
  const [deleteId, setDeleteId] = useState(null);

  // New Routine Dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [newRoutine, setNewRoutine] = useState({
    name: '',
    description: '',
    category: 'ppl',
    days_per_week: 3,
  });

  useEffect(() => {
    loadRoutines();
  }, []);

  const loadRoutines = async () => {
    setLoading(true);
    try {
      const data = await routineService.getAll();
      setRoutines(data);
    } catch (err) {
      console.error('Failed to load routines', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClone = async (routine) => {
    try {
      const cloned = await routineService.clone(routine.id, `My ${routine.name}`);
      setRoutines((prev) => [cloned, ...prev]);
      router.push(`/routines/${cloned.id}/edit`);
    } catch (err) {
      console.error('Failed to clone routine', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await routineService.delete(deleteId);
      setRoutines((prev) => prev.filter((r) => r.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('Failed to delete routine', err);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await routineService.create({
        ...newRoutine,
        days: [
          { day_number: 1, name: 'Day 1', description: '', routine_exercises: [] },
        ],
      });
      setRoutines((prev) => [created, ...prev]);
      setCreateOpen(false);
      router.push(`/routines/${created.id}`);
    } catch (err) {
      console.error('Failed to create routine', err);
    }
  };

  const filteredRoutines = routines.filter((r) => {
    if (tabValue === 1) return r.is_template;
    if (tabValue === 2) return !r.is_template;
    return true;
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
            Training Routines
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Structured workout splits designed for hypertrophy, strength, and progression.
          </Typography>
        </Box>

        <Button
          component={Link}
          href="/routines/new"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ fontWeight: 700, px: 3 }}
        >
          Create Custom Routine
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={(e, val) => setTabValue(val)}
        sx={{ mb: 3, borderBottom: `1px solid ${theme.palette.divider}` }}
      >
        <Tab label="All Routines" sx={{ fontWeight: 600 }} />
        <Tab label="Featured Templates" sx={{ fontWeight: 600 }} />
        <Tab label="My Custom Splits" sx={{ fontWeight: 600 }} />
      </Tabs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : filteredRoutines.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <ListAltIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            No routines found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first workout routine or choose one of our templates.
          </Typography>
          <Button variant="contained" onClick={() => setCreateOpen(true)}>
            Build Routine
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredRoutines.map((r) => (
            <Grid item xs={12} md={6} key={r.id}>
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
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box>
                      <Typography
                        component={Link}
                        href={`/routines/${r.id}`}
                        variant="h6"
                        sx={{ fontWeight: 800, color: 'inherit', '&:hover': { color: theme.palette.primary.main } }}
                      >
                        {r.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {r.category_display || r.category} • {r.days_per_week} days/week
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {r.is_template ? (
                        <Chip label="Template" size="small" color="primary" variant="outlined" sx={{ fontWeight: 700 }} />
                      ) : (
                        <IconButton
                          size="small"
                          color="default"
                          onClick={() => setDeleteId(r.id)}
                          sx={{ '&:hover': { color: theme.palette.error.main } }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    {r.description || 'No description provided.'}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                    {r.days?.map((day) => (
                      <Chip
                        key={day.id}
                        label={`Day ${day.day_number}: ${day.name}`}
                        size="small"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto', flexWrap: 'wrap' }}>
                    <Button
                      component={Link}
                      href={`/routines/${r.id}`}
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ borderRadius: 2, fontWeight: 700 }}
                    >
                      View Routine
                    </Button>

                    {r.is_template ? (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ContentCopyIcon />}
                        onClick={() => handleClone(r)}
                        sx={{ borderRadius: 2, fontWeight: 600 }}
                      >
                        Clone & Customize
                      </Button>
                    ) : (
                      <Button
                        component={Link}
                        href={`/routines/${r.id}/edit`}
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        sx={{ borderRadius: 2, fontWeight: 600 }}
                      >
                        Edit
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Routine Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create New Routine</DialogTitle>
        <Box component="form" onSubmit={handleCreateSubmit}>
          <DialogContent dividers>
            <TextField
              label="Routine Name"
              fullWidth
              required
              placeholder="e.g. Hypertrophy Split 4-Day"
              value={newRoutine.name}
              onChange={(e) => setNewRoutine({ ...newRoutine, name: e.target.value })}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={newRoutine.category}
                label="Category"
                onChange={(e) => setNewRoutine({ ...newRoutine, category: e.target.value })}
              >
                <MenuItem value="ppl">Push / Pull / Legs</MenuItem>
                <MenuItem value="upper_lower">Upper / Lower Split</MenuItem>
                <MenuItem value="full_body">Full Body</MenuItem>
                <MenuItem value="bro_split">Body Part Split</MenuItem>
                <MenuItem value="custom">Custom Routine</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Days Per Week"
              type="number"
              fullWidth
              size="small"
              inputProps={{ min: 1, max: 7 }}
              value={newRoutine.days_per_week}
              onChange={(e) => setNewRoutine({ ...newRoutine, days_per_week: parseInt(e.target.value, 10) || 3 })}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              placeholder="Describe goals, focus areas, or split schedule..."
              value={newRoutine.description}
              onChange={(e) => setNewRoutine({ ...newRoutine, description: e.target.value })}
            />
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setCreateOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Create & Add Days
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Routine"
        message="Are you sure you want to delete this custom routine?"
        confirmText="Delete"
        confirmColor="error"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AddIcon from '@mui/icons-material/Add';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StraightenIcon from '@mui/icons-material/Straighten';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { analyticsService } from '../../../services/analyticsService';
import { exerciseService } from '../../../services/exerciseService';
import { measurementService } from '../../../services/measurementService';
import { useAuth } from '../../../context/AuthContext';

export default function ProgressPage() {
  const theme = useTheme();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState(0); // 0: Strength 1RM, 1: Body Measurements, 2: PR Shelf
  const [exercises, setExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [progressionData, setProgressionData] = useState([]);
  const [progressionLoading, setProgressionLoading] = useState(false);

  // Measurements
  const [measurements, setMeasurements] = useState([]);
  const [measurementsLoading, setMeasurementsLoading] = useState(true);
  const [measureModalOpen, setMeasureModalOpen] = useState(false);
  const [newMeasurement, setNewMeasurement] = useState({
    date: new Date().toISOString().split('T')[0],
    weight_kg: '',
    body_fat_pct: '',
    chest_cm: '',
    waist_cm: '',
    biceps_cm: '',
    thigh_cm: '',
    notes: '',
  });

  // Personal Records
  const [personalRecords, setPersonalRecords] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [exList, prList, mList] = await Promise.all([
        exerciseService.getAll(),
        analyticsService.getPersonalRecords(),
        measurementService.getAll(),
      ]);
      setExercises(exList);
      setPersonalRecords(prList);
      setMeasurements(mList);

      if (exList.length > 0) {
        setSelectedExerciseId(exList[0].id);
        loadExerciseProgression(exList[0].id);
      }
    } catch (err) {
      console.error('Failed to load progress data', err);
    } finally {
      setMeasurementsLoading(false);
    }
  };

  const loadExerciseProgression = async (exerciseId) => {
    setProgressionLoading(true);
    try {
      const res = await analyticsService.getExerciseProgression(exerciseId);
      setProgressionData(res.history || []);
    } catch (err) {
      console.error('Failed to load progression', err);
    } finally {
      setProgressionLoading(false);
    }
  };

  const handleExerciseChange = (e) => {
    const exId = e.target.value;
    setSelectedExerciseId(exId);
    loadExerciseProgression(exId);
  };

  const handleSaveMeasurement = async (e) => {
    e.preventDefault();
    try {
      const saved = await measurementService.create(newMeasurement);
      setMeasurements((prev) => [saved, ...prev]);
      setMeasureModalOpen(false);
      setNewMeasurement({
        date: new Date().toISOString().split('T')[0],
        weight_kg: '',
        body_fat_pct: '',
        chest_cm: '',
        waist_cm: '',
        biceps_cm: '',
        thigh_cm: '',
        notes: '',
      });
    } catch (err) {
      console.error('Failed to save measurement', err);
    }
  };

  const preferredUnits = user?.profile?.preferred_units || 'kg';

  // Format measurements for weight chart
  const weightChartData = [...measurements]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((m) => ({
      date: m.date,
      weight_kg: parseFloat(m.weight_kg) || null,
      body_fat_pct: parseFloat(m.body_fat_pct) || null,
    }));

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
            Analytics & Progress
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Visualize your 1RM progression curves, body weight changes, and record milestones.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setMeasureModalOpen(true)}
          sx={{ fontWeight: 700 }}
        >
          Log Measurement
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, val) => setActiveTab(val)}
        sx={{ mb: 3, borderBottom: `1px solid ${theme.palette.divider}` }}
      >
        <Tab label="Strength & 1RM Progression" sx={{ fontWeight: 600 }} />
        <Tab label="Body Weight & Composition" sx={{ fontWeight: 600 }} />
        <Tab label="All Personal Records" sx={{ fontWeight: 600 }} />
      </Tabs>

      {/* Tab 0: Strength & 1RM Progression */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <CardContent>
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
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      1RM & Heaviest Set Over Time
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Calculated using the Epley formula: Weight × (1 + Reps / 30)
                    </Typography>
                  </Box>

                  <FormControl size="small" sx={{ minWidth: 260 }}>
                    <InputLabel>Select Exercise</InputLabel>
                    <Select
                      value={selectedExerciseId}
                      label="Select Exercise"
                      onChange={handleExerciseChange}
                    >
                      {exercises.map((ex) => (
                        <MenuItem key={ex.id} value={ex.id}>
                          {ex.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {progressionLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                    <CircularProgress color="primary" />
                  </Box>
                ) : progressionData.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <ShowChartIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body1" color="text.secondary">
                      No recorded sets for this exercise yet. Log workouts containing this exercise to see the progression graph.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ width: '100%', height: 350 }}>
                    {mounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={progressionData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                          <XAxis
                            dataKey="date"
                            stroke={theme.palette.text.secondary}
                            fontSize={12}
                          />
                          <YAxis
                            stroke={theme.palette.text.secondary}
                            fontSize={12}
                            unit={` ${preferredUnits}`}
                          />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: theme.palette.background.paper,
                              borderColor: theme.palette.divider,
                              borderRadius: 8,
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="estimated_1rm"
                            name="Estimated 1RM"
                            stroke="#288474"
                            strokeWidth={3}
                            dot={{ r: 5, fill: '#288474' }}
                            activeDot={{ r: 7 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="max_weight"
                            name="Max Weight Lifted"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            dot={{ r: 4, fill: '#f59e0b' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : null}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tab 1: Body Weight & Composition */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3, mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Body Weight Trend
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
                  Scale weight tracked over time
                </Typography>

                {weightChartData.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Typography color="text.secondary">No body weight entries recorded yet.</Typography>
                  </Box>
                ) : (
                  <Box sx={{ width: '100%', height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={weightChartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                        <XAxis dataKey="date" stroke={theme.palette.text.secondary} fontSize={12} />
                        <YAxis stroke={theme.palette.text.secondary} fontSize={12} unit=" kg" domain={['auto', 'auto']} />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: theme.palette.background.paper,
                            borderColor: theme.palette.divider,
                            borderRadius: 8,
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="weight_kg"
                          name="Weight"
                          stroke="#288474"
                          strokeWidth={3}
                          dot={{ r: 5, fill: '#288474' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Measurements Table */}
          <Grid item xs={12}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Measurement Logs
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setMeasureModalOpen(true)}
                  >
                    Add Entry
                  </Button>
                </Box>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>DATE</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>WEIGHT</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>BODY FAT %</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>CHEST</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>WAIST</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>BICEPS</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>THIGH</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {measurements.map((m) => (
                        <TableRow key={m.id}>
                          <TableCell sx={{ fontWeight: 600 }}>{m.date}</TableCell>
                          <TableCell>{m.weight_kg ? `${m.weight_kg} kg` : '-'}</TableCell>
                          <TableCell>{m.body_fat_pct ? `${m.body_fat_pct}%` : '-'}</TableCell>
                          <TableCell>{m.chest_cm ? `${m.chest_cm} cm` : '-'}</TableCell>
                          <TableCell>{m.waist_cm ? `${m.waist_cm} cm` : '-'}</TableCell>
                          <TableCell>{m.biceps_cm ? `${m.biceps_cm} cm` : '-'}</TableCell>
                          <TableCell>{m.thigh_cm ? `${m.thigh_cm} cm` : '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tab 2: All Personal Records */}
      {activeTab === 2 && (
        <Card sx={{ p: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              All Personal Records
            </Typography>

            {personalRecords.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography color="text.secondary">No personal records yet.</Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {personalRecords.map((pr) => (
                  <Grid item xs={12} sm={6} md={4} key={pr.id}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        <EmojiEventsIcon sx={{ color: '#f59e0b' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {pr.exercise_name}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {pr.record_type === 'max_weight' ? 'Heaviest Weight Lifted' : 'Estimated 1RM'}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: theme.palette.primary.main, my: 0.5 }}>
                        {pr.value} {preferredUnits}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Set on {new Date(pr.achieved_at).toLocaleDateString()}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      )}

      {/* Log Measurement Modal */}
      <Dialog open={measureModalOpen} onClose={() => setMeasureModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Log Body Measurements</DialogTitle>
        <Box component="form" onSubmit={handleSaveMeasurement}>
          <DialogContent dividers>
            <TextField
              label="Date"
              type="date"
              fullWidth
              required
              value={newMeasurement.date}
              onChange={(e) => setNewMeasurement({ ...newMeasurement, date: e.target.value })}
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Weight (kg)"
                  type="number"
                  fullWidth
                  inputProps={{ step: 0.1 }}
                  value={newMeasurement.weight_kg}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, weight_kg: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Body Fat %"
                  type="number"
                  fullWidth
                  inputProps={{ step: 0.1 }}
                  value={newMeasurement.body_fat_pct}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, body_fat_pct: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Chest (cm)"
                  type="number"
                  fullWidth
                  inputProps={{ step: 0.5 }}
                  value={newMeasurement.chest_cm}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, chest_cm: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Waist (cm)"
                  type="number"
                  fullWidth
                  inputProps={{ step: 0.5 }}
                  value={newMeasurement.waist_cm}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, waist_cm: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Biceps (cm)"
                  type="number"
                  fullWidth
                  inputProps={{ step: 0.5 }}
                  value={newMeasurement.biceps_cm}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, biceps_cm: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Thigh (cm)"
                  type="number"
                  fullWidth
                  inputProps={{ step: 0.5 }}
                  value={newMeasurement.thigh_cm}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, thigh_cm: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setMeasureModalOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Save Entry
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

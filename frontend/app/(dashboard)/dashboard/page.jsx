'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  useTheme,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import StatCard from '../../../components/common/StatCard';
import { useAuth } from '../../../context/AuthContext';
import { useWorkoutTracker } from '../../../context/WorkoutTrackingContext';
import { analyticsService } from '../../../services/analyticsService';
import { workoutService } from '../../../services/workoutService';
import { formatDuration, formatShortDuration } from '../../../utils/calculations';

const PIE_COLORS = ['#288474', '#3ba492', '#f59e0b', '#6366f1', '#ec4899', '#10b981', '#8b5cf6'];

export default function DashboardPage() {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuth();
  const { isActive, startWorkout } = useWorkoutTracker();

  const [summary, setSummary] = useState(null);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [sumData, workoutsData] = await Promise.all([
        analyticsService.getDashboardSummary(),
        workoutService.getAll({ page_size: 5 }),
      ]);
      setSummary(sumData);
      setRecentWorkouts(Array.isArray(workoutsData) ? workoutsData.slice(0, 5) : (workoutsData?.results?.slice(0, 5) || []));
    } catch (err) {
      console.error('Failed to load dashboard data', err);
      setError('Could not load some dashboard analytics. Click to retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartWorkout = () => {
    if (isActive) {
      router.push('/workouts/active');
    } else {
      startWorkout({ title: 'New Workout Session' });
      router.push('/workouts/active');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const preferredUnits = user?.profile?.preferred_units || 'kg';

  return (
    <Box>
      {/* Header & Quick Action */}
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
            Welcome back, {user?.first_name || user?.username}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here is your training overview and performance progression.
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          color="primary"
          startIcon={isActive ? <PlayArrowIcon /> : <AddIcon />}
          onClick={handleStartWorkout}
          sx={{
            py: 1.2,
            px: 3,
            fontWeight: 700,
            borderRadius: 2.5,
            boxShadow: '0 4px 18px rgba(40, 132, 116, 0.4)',
          }}
        >
          {isActive ? 'Resume Active Session' : 'Start New Workout'}
        </Button>
      </Box>

      {/* Analytics Notice / Error Recovery */}
      {error && (
        <Alert
          severity="warning"
          action={
            <Button color="inherit" size="small" onClick={loadDashboardData}>
              Retry
            </Button>
          }
          sx={{ mb: 3, borderRadius: 2 }}
        >
          {error}
        </Alert>
      )}

      {/* Top Stat Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Workouts"
            value={summary?.total_workouts ?? 0}
            subtitle={`${summary?.workouts_this_week ?? 0} completed this week`}
            icon={<FitnessCenterIcon />}
            color="primary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Volume"
            value={`${Math.round(summary?.total_volume_kg || 0).toLocaleString()} ${preferredUnits}`}
            subtitle="Cumulative weight moved"
            icon={<ShowChartIcon />}
            color="secondary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Hours Trained"
            value={`${summary?.total_hours ?? 0} hrs`}
            subtitle="Time under tension"
            icon={<AccessTimeIcon />}
            color="info"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Streak"
            value={`${summary?.workouts_this_month ?? 0}`}
            subtitle="Workouts in last 30 days"
            icon={<WhatshotIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Weekly Volume Progression */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%', p: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Weekly Volume Trend
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total kilograms moved across previous training weeks
                  </Typography>
                </Box>
                <Chip label="8 Weeks" size="small" variant="outlined" />
              </Box>

              <Box sx={{ width: '100%', height: 280 }}>
                {mounted && summary?.weekly_volume && summary.weekly_volume.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={summary.weekly_volume} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis
                        dataKey="week"
                        stroke={theme.palette.text.secondary}
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis
                        stroke={theme.palette.text.secondary}
                        fontSize={12}
                        tickLine={false}
                        tickFormatter={(v) => `${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          borderColor: theme.palette.divider,
                          borderRadius: 8,
                        }}
                        formatter={(val) => [`${Math.round(val).toLocaleString()} ${preferredUnits}`, 'Volume']}
                      />
                      <Bar
                        dataKey="volume_kg"
                        fill="#288474"
                        radius={[6, 6, 0, 0]}
                        animationDuration={1200}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography color="text.secondary">No workout volume data logged yet.</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Muscle Distribution Pie */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%', p: 2 }}>
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Muscle Group Balance
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Distribution of total sets logged
                </Typography>
              </Box>

              <Box sx={{ width: '100%', height: 220 }}>
                {mounted && summary?.muscle_distribution && summary.muscle_distribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={summary.muscle_distribution}
                        dataKey="sets"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                      >
                        {summary.muscle_distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          borderColor: theme.palette.divider,
                          borderRadius: 8,
                        }}
                        formatter={(val, name) => [`${val} sets`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography color="text.secondary">Log workouts to see muscle distribution</Typography>
                  </Box>
                )}
              </Box>

              {/* Legend Chips */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, justifyContent: 'center', mt: 1 }}>
                {summary?.muscle_distribution?.slice(0, 5).map((m, idx) => (
                  <Chip
                    key={m.name}
                    label={`${m.name}: ${m.sets} sets`}
                    size="small"
                    sx={{
                      fontSize: '0.75rem',
                      borderLeft: `4px solid ${PIE_COLORS[idx % PIE_COLORS.length]}`,
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Row: Recent Workouts & Personal Records */}
      <Grid container spacing={3}>
        {/* Recent Workouts */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%', p: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Recent Workouts
                </Typography>
                <Button
                  component={Link}
                  href="/workouts"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                >
                  View All
                </Button>
              </Box>

              {recentWorkouts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    You have not logged any workouts yet.
                  </Typography>
                  <Button variant="outlined" size="small" onClick={handleStartWorkout}>
                    Record First Session
                  </Button>
                </Box>
              ) : (
                <List disablePadding>
                  {recentWorkouts.map((w, idx) => (
                    <React.Fragment key={w.id}>
                      <ListItem
                        sx={{
                          py: 1.5,
                          px: 1,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 38,
                              height: 38,
                              borderRadius: 2,
                              backgroundColor: 'rgba(40, 132, 116, 0.12)',
                              color: theme.palette.primary.main,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <FitnessCenterIcon fontSize="small" />
                          </Box>
                          <Box>
                            <Typography
                              component={Link}
                              href={`/workouts/${w.id}`}
                              variant="subtitle2"
                              sx={{ fontWeight: 700, '&:hover': { color: theme.palette.primary.main } }}
                            >
                              {w.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(w.started_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })} • {formatShortDuration(w.duration_seconds)}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {Math.round(w.total_volume_kg).toLocaleString()} {preferredUnits}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {w.total_reps} reps
                          </Typography>
                        </Box>
                      </ListItem>
                      {idx < recentWorkouts.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent PRs / Badges */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%', p: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmojiEventsIcon sx={{ color: '#f59e0b' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Personal Records
                  </Typography>
                </Box>
                <Button component={Link} href="/progress" size="small">
                  Full Analytics
                </Button>
              </Box>

              {summary?.recent_prs && summary.recent_prs.length > 0 ? (
                <List disablePadding>
                  {summary.recent_prs.map((pr, idx) => (
                    <React.Fragment key={pr.id}>
                      <ListItem sx={{ py: 1.5, px: 1 }}>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                              {pr.exercise_name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {pr.record_type === 'max_weight' ? 'Max Weight' : 'Estimated 1RM'} •{' '}
                              {new Date(pr.achieved_at).toLocaleDateString()}
                            </Typography>
                          }
                        />
                        <Chip
                          label={`${pr.value} ${preferredUnits}`}
                          color="secondary"
                          size="small"
                          sx={{ fontWeight: 700, fontSize: '0.85rem' }}
                        />
                      </ListItem>
                      {idx < summary.recent_prs.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <Typography variant="body2" color="text.secondary">
                    No personal records logged yet. Complete sets to set your first records!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import RefreshIcon from '@mui/icons-material/Refresh';
import confetti from 'canvas-confetti';
import { useAuth } from '../../../context/AuthContext';
import { useThemeMode } from '../../../context/ThemeContext';
import { achievementService } from '../../../services/achievementService';

const BADGE_COLORS = {
  bronze: '#cd7f32',
  silver: '#94a3b8',
  gold: '#f59e0b',
  platinum: '#06b6d4',
};

export default function ProfilePage() {
  const theme = useTheme();
  const { user, updateProfile } = useAuth();
  const { mode, setThemeMode } = useThemeMode();

  const [activeTab, setActiveTab] = useState(0); // 0: Profile Info, 1: Badges Shelf
  const [achievements, setAchievements] = useState([]);
  const [achievementsLoading, setAchievementsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [evaluating, setEvaluating] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    fitness_goal: 'hypertrophy',
    activity_level: 'moderately_active',
    preferred_units: 'kg',
    height_cm: '',
    weight_kg: '',
    target_weight_kg: '',
    theme_mode: 'dark',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        bio: user.profile?.bio || '',
        fitness_goal: user.profile?.fitness_goal || 'hypertrophy',
        activity_level: user.profile?.activity_level || 'moderately_active',
        preferred_units: user.profile?.preferred_units || 'kg',
        height_cm: user.profile?.height_cm || '',
        weight_kg: user.profile?.weight_kg || '',
        target_weight_kg: user.profile?.target_weight_kg || '',
        theme_mode: user.profile?.theme_mode || mode,
      });
    }
    loadAchievements();
  }, [user]);

  const loadAchievements = async () => {
    setAchievementsLoading(true);
    try {
      const data = await achievementService.getAll();
      setAchievements(data);
    } catch (err) {
      console.error('Failed to load achievements', err);
    } finally {
      setAchievementsLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await updateProfile(formData);
      if (formData.theme_mode !== mode) {
        setThemeMode(formData.theme_mode);
      }
      setSuccessMsg('Profile settings updated successfully.');
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setSaving(false);
    }
  };

  const handleEvaluateBadges = async () => {
    setEvaluating(true);
    try {
      const res = await achievementService.evaluate();
      if (res.newly_unlocked_count > 0) {
        try {
          confetti({
            particleCount: 100,
            spread: 60,
            colors: ['#f59e0b', '#288474', '#ffffff'],
          });
        } catch (e) {}
        setSuccessMsg(`Unlocked ${res.newly_unlocked_count} new achievement(s)!`);
      } else {
        setSuccessMsg('All achievements are up to date.');
      }
      loadAchievements();
    } catch (err) {
      console.error('Failed to evaluate achievements', err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Athlete Profile & Achievements
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your fitness goals, biometric targets, and earned trophy badges.
        </Typography>
      </Box>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {successMsg}
        </Alert>
      )}

      <Tabs
        value={activeTab}
        onChange={(e, val) => setActiveTab(val)}
        sx={{ mb: 3, borderBottom: `1px solid ${theme.palette.divider}` }}
      >
        <Tab label="Profile & Goals" sx={{ fontWeight: 600 }} />
        <Tab label="Trophy & Badges Shelf" sx={{ fontWeight: 600 }} />
      </Tabs>

      {/* Tab 0: Profile & Goals */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Summary Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: theme.palette.primary.main,
                  fontSize: '2rem',
                  fontWeight: 700,
                }}
              >
                {user?.first_name ? user.first_name[0].toUpperCase() : user?.username[0].toUpperCase()}
              </Avatar>

              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                @{user?.username} • {user?.email}
              </Typography>

              <Chip
                label={`Goal: ${formData.fitness_goal.toUpperCase()}`}
                color="primary"
                size="small"
                sx={{ fontWeight: 700, mb: 2 }}
              />

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Weight
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {formData.weight_kg ? `${formData.weight_kg} kg` : '-'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Target
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {formData.target_weight_kg ? `${formData.target_weight_kg} kg` : '-'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Height
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {formData.height_cm ? `${formData.height_cm} cm` : '-'}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Edit Form */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Edit Profile & Preferences
                </Typography>

                <Box component="form" onSubmit={handleProfileSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="First Name"
                        fullWidth
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Last Name"
                        fullWidth
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Bio"
                        fullWidth
                        multiline
                        rows={2}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Primary Fitness Goal</InputLabel>
                        <Select
                          value={formData.fitness_goal}
                          label="Primary Fitness Goal"
                          onChange={(e) => setFormData({ ...formData, fitness_goal: e.target.value })}
                        >
                          <MenuItem value="hypertrophy">Muscle Gain / Hypertrophy</MenuItem>
                          <MenuItem value="strength">Strength & Power</MenuItem>
                          <MenuItem value="weight_loss">Weight Loss / Fat Loss</MenuItem>
                          <MenuItem value="endurance">Endurance & Stamina</MenuItem>
                          <MenuItem value="general_fitness">General Health</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Activity Level</InputLabel>
                        <Select
                          value={formData.activity_level}
                          label="Activity Level"
                          onChange={(e) => setFormData({ ...formData, activity_level: e.target.value })}
                        >
                          <MenuItem value="sedentary">Sedentary</MenuItem>
                          <MenuItem value="lightly_active">Lightly Active</MenuItem>
                          <MenuItem value="moderately_active">Moderately Active</MenuItem>
                          <MenuItem value="very_active">Very Active</MenuItem>
                          <MenuItem value="extremely_active">Extremely Active</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Height (cm)"
                        type="number"
                        fullWidth
                        size="small"
                        value={formData.height_cm}
                        onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Current Weight (kg)"
                        type="number"
                        fullWidth
                        size="small"
                        value={formData.weight_kg}
                        onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Target Weight (kg)"
                        type="number"
                        fullWidth
                        size="small"
                        value={formData.target_weight_kg}
                        onChange={(e) => setFormData({ ...formData, target_weight_kg: e.target.value })}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Preferred Units</InputLabel>
                        <Select
                          value={formData.preferred_units}
                          label="Preferred Units"
                          onChange={(e) => setFormData({ ...formData, preferred_units: e.target.value })}
                        >
                          <MenuItem value="kg">Kilograms (kg)</MenuItem>
                          <MenuItem value="lbs">Pounds (lbs)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Theme Mode</InputLabel>
                        <Select
                          value={formData.theme_mode}
                          label="Theme Mode"
                          onChange={(e) => setFormData({ ...formData, theme_mode: e.target.value })}
                        >
                          <MenuItem value="dark">Dark Theme (Premium)</MenuItem>
                          <MenuItem value="light">Light Theme</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={saving}
                      sx={{ fontWeight: 700, px: 3 }}
                    >
                      {saving ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tab 1: Badges Shelf */}
      {activeTab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Achievements & Milestones
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Badges unlocked through workout consistency, volume thresholds, and heavy lifting.
              </Typography>
            </Box>

            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              disabled={evaluating}
              onClick={handleEvaluateBadges}
            >
              {evaluating ? 'Evaluating...' : 'Check Milestones'}
            </Button>
          </Box>

          {achievementsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <Grid container spacing={2.5}>
              {achievements.map((ach) => {
                const isUnlocked = ach.is_unlocked;
                const badgeColor = BADGE_COLORS[ach.badge_level] || theme.palette.primary.main;

                return (
                  <Grid item xs={12} sm={6} md={4} key={ach.id}>
                    <Card
                      sx={{
                        p: 2.5,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        border: isUnlocked ? `1px solid ${badgeColor}` : `1px solid ${theme.palette.divider}`,
                        backgroundColor: isUnlocked
                          ? theme.palette.mode === 'dark'
                            ? 'rgba(40, 132, 116, 0.08)'
                            : 'rgba(40, 132, 116, 0.05)'
                          : 'inherit',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            backgroundColor: isUnlocked ? badgeColor : 'rgba(255,255,255,0.06)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <EmojiEventsIcon />
                        </Box>

                        <Chip
                          label={ach.badge_level.toUpperCase()}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: '0.65rem',
                            backgroundColor: isUnlocked ? badgeColor : undefined,
                            color: isUnlocked ? '#ffffff' : undefined,
                          }}
                        />
                      </Box>

                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                        {ach.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                        {ach.description}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto', pt: 1 }}>
                        {isUnlocked ? (
                          <>
                            <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 18 }} />
                            <Typography variant="caption" sx={{ color: theme.palette.success.main, fontWeight: 700 }}>
                              Unlocked {ach.unlocked_at ? `on ${new Date(ach.unlocked_at).toLocaleDateString()}` : ''}
                            </Typography>
                          </>
                        ) : (
                          <>
                            <LockIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                            <Typography variant="caption" color="text.secondary">
                              Locked (Threshold: {ach.threshold})
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Chip,
  Tooltip,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import SyncIcon from '@mui/icons-material/Sync';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeContext';
import { useWorkoutTracker } from '../../context/WorkoutTrackingContext';
import { formatDuration } from '../../utils/calculations';

export default function Navbar({ onToggleSidebar }) {
  const router = useRouter();
  const theme = useTheme();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const { isActive, activeWorkout, duration, isOnline, offlineCount, syncOfflineQueue } = useWorkoutTracker();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(12, 17, 22, 0.92)' : 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
        zIndex: (th) => th.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onToggleSidebar}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                backgroundColor: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 2px 10px rgba(40, 132, 116, 0.4)',
              }}
            >
              <FitnessCenterIcon fontSize="small" />
            </Box>
            <Box>
              <Typography
                variant="h6"
                component="span"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  background: 'linear-gradient(135deg, #288474 0%, #4ecdc4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                FIT
              </Typography>
              <Typography
                variant="caption"
                component="span"
                sx={{
                  display: { xs: 'none', sm: 'inline' },
                  ml: 0.75,
                  px: 0.8,
                  py: 0.2,
                  borderRadius: 1,
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                  color: theme.palette.text.secondary,
                  fontWeight: 600,
                  fontSize: '0.65rem',
                }}
              >
                by Webryxon
              </Typography>
            </Box>
          </Link>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          {/* Active Workout Banner / Quick return */}
          {isActive && (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<PlayCircleFilledIcon sx={{ color: theme.palette.success.main }} className="pulse-recording" />}
              onClick={() => router.push('/workouts/active')}
              sx={{
                borderRadius: 20,
                borderColor: 'rgba(40, 132, 116, 0.4)',
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(40, 132, 116, 0.12)' : 'rgba(40, 132, 116, 0.08)',
                fontWeight: 600,
                px: 2,
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, mr: 1 }}>
                {activeWorkout?.title || 'Workout'}:
              </Box>
              {formatDuration(duration)}
            </Button>
          )}

          {/* Offline Indicator & Sync */}
          {!isOnline && (
            <Tooltip title="You are offline. Workouts are saved locally.">
              <Chip
                icon={<CloudOffIcon fontSize="small" />}
                label="Offline"
                color="warning"
                size="small"
                variant="outlined"
              />
            </Tooltip>
          )}

          {offlineCount > 0 && isOnline && (
            <Tooltip title={`${offlineCount} workouts queued for sync`}>
              <IconButton size="small" color="primary" onClick={syncOfflineQueue}>
                <SyncIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {/* Theme Mode Toggle */}
          <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton onClick={toggleTheme} color="inherit" size="small">
              {mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
            </IconButton>
          </Tooltip>

          {/* User Profile Avatar & Menu */}
          {user ? (
            <>
              <IconButton onClick={handleProfileMenuOpen} size="small" sx={{ p: 0.5 }}>
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: theme.palette.primary.main,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                >
                  {user.first_name ? user.first_name[0].toUpperCase() : user.username[0].toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 180,
                    borderRadius: 2,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {user.first_name ? `${user.first_name} ${user.last_name || ''}` : user.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <MenuItem onClick={() => { handleMenuClose(); router.push('/profile'); }}>
                  <PersonIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
                  Profile & Badges
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: theme.palette.error.main }}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="contained"
              size="small"
              onClick={() => router.push('/login')}
              sx={{ fontWeight: 600 }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

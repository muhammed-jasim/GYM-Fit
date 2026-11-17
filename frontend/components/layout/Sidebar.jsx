'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useWorkoutTracker } from '../../context/WorkoutTrackingContext';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Workouts', path: '/workouts', icon: <FitnessCenterIcon /> },
  { label: 'Exercises', path: '/exercises', icon: <LibraryBooksIcon /> },
  { label: 'Routines', path: '/routines', icon: <ListAltIcon /> },
  { label: 'Progress & Analytics', path: '/progress', icon: <ShowChartIcon /> },
  { label: 'Schedule', path: '/schedule', icon: <CalendarMonthIcon /> },
  { label: 'Profile & Badges', path: '/profile', icon: <PersonOutlineIcon /> },
];

export const DRAWER_WIDTH = 250;

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { isActive, startWorkout } = useWorkoutTracker();

  const handleStartQuickWorkout = () => {
    if (isActive) {
      router.push('/workouts/active');
    } else {
      startWorkout({ title: 'Quick Workout Session' });
      router.push('/workouts/active');
    }
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', py: 2 }}>
      {/* Brand logo in mobile drawer */}
      {!isDesktop && (
        <Box sx={{ px: 3, pb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              backgroundColor: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <FitnessCenterIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            FIT
          </Typography>
        </Box>
      )}

      {/* Start Workout Primary Action */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleStartQuickWorkout}
          sx={{
            py: 1.2,
            fontWeight: 700,
            boxShadow: '0 4px 14px rgba(40, 132, 116, 0.35)',
          }}
        >
          {isActive ? 'Resume Workout' : 'Start Workout'}
        </Button>
      </Box>

      <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />

      {/* Navigation List */}
      <List sx={{ px: 1.5, flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isSelected = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.path}
                onClick={!isDesktop ? onMobileClose : undefined}
                selected={isSelected}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  px: 2,
                  color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary,
                  backgroundColor: isSelected
                    ? theme.palette.mode === 'dark'
                      ? 'rgba(40, 132, 116, 0.15)'
                      : 'rgba(40, 132, 116, 0.1)'
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                    color: theme.palette.text.primary,
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(40, 132, 116, 0.22)' : 'rgba(40, 132, 116, 0.15)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 38,
                    color: isSelected ? theme.palette.primary.main : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isSelected ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer Info */}
      <Box sx={{ px: 3, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="caption" color="text.secondary" display="block">
          Webryxon FIT v1.0
        </Typography>
        <Typography variant="caption" sx={{ color: theme.palette.primary.main, fontSize: '0.7rem' }}>
          fit.webryxon.com
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
            top: 64, // Below navbar
            height: 'calc(100vh - 64px)',
            position: 'fixed',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

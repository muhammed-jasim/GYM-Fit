'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Paper, BottomNavigation, BottomNavigationAction, useTheme } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PersonIcon from '@mui/icons-material/Person';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();

  let currentValue = '/dashboard';
  if (pathname.startsWith('/workouts')) currentValue = '/workouts';
  else if (pathname.startsWith('/routines')) currentValue = '/routines';
  else if (pathname.startsWith('/progress')) currentValue = '/progress';
  else if (pathname.startsWith('/profile')) currentValue = '/profile';

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: { xs: 'block', md: 'none' },
        zIndex: 1000,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={currentValue}
        onChange={(event, newValue) => {
          router.push(newValue);
        }}
        sx={{
          backgroundColor: theme.palette.background.paper,
          '& .Mui-selected': {
            color: theme.palette.primary.main,
          },
        }}
      >
        <BottomNavigationAction label="Home" value="/dashboard" icon={<DashboardIcon />} />
        <BottomNavigationAction label="Workouts" value="/workouts" icon={<FitnessCenterIcon />} />
        <BottomNavigationAction label="Routines" value="/routines" icon={<ListAltIcon />} />
        <BottomNavigationAction label="Analytics" value="/progress" icon={<ShowChartIcon />} />
        <BottomNavigationAction label="Profile" value="/profile" icon={<PersonIcon />} />
      </BottomNavigation>
    </Paper>
  );
}

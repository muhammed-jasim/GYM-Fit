'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, useTheme } from '@mui/material';
import Navbar from '../../components/layout/Navbar';
import Sidebar, { DRAWER_WIDTH } from '../../components/layout/Sidebar';
import BottomNav from '../../components/layout/BottomNav';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const theme = useTheme();
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleToggleSidebar = () => {
    setMobileOpen((prev) => !prev);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      {/* 1. Full-width Top Navigation Bar */}
      <Navbar onToggleSidebar={handleToggleSidebar} />

      {/* 2. Main Horizontal Content Section (Sidebar on left, Children on right) */}
      <Box sx={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
            maxWidth: 1600,
            mx: 'auto',
            mb: { xs: '70px', md: 2 },
          }}
        >
          {children}
        </Box>
      </Box>

      {/* 3. Mobile Bottom Navigation */}
      <BottomNav />
    </Box>
  );
}

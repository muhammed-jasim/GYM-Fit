'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  useTheme,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TimerIcon from '@mui/icons-material/Timer';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const theme = useTheme();
  const { user, loading, demoLogin } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleDemoSignIn = async () => {
    try {
      await demoLogin();
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      router.push('/login');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(40, 132, 116, 0.15) 0%, transparent 60%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Header */}
      <Box
        component="header"
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          py: 2,
          px: { xs: 2, md: 6 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
            }}
          >
            <FitnessCenterIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '0.05em' }}>
            FIT
          </Typography>
          <Chip label="by Webryxon" size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="text" component={Link} href="/login" color="inherit">
            Sign In
          </Button>
          <Button variant="contained" component={Link} href="/register" color="primary">
            Get Started
          </Button>
        </Box>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 14 }, flexGrow: 1, textAlign: 'center' }}>
        <Chip
          icon={<FlashOnIcon fontSize="small" />}
          label="Next-Gen Workout Tracking Platform"
          color="primary"
          variant="outlined"
          sx={{ mb: 3, px: 1, py: 2, borderRadius: 3, fontWeight: 600 }}
        />

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', sm: '3.75rem', md: '4.5rem' },
            fontWeight: 800,
            lineHeight: 1.15,
            mb: 3,
            maxWidth: 900,
            mx: 'auto',
          }}
        >
          Track Every Lift.{' '}
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(135deg, #288474 0%, #4ecdc4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Break Every Limit.
          </Box>
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            maxWidth: 680,
            mx: 'auto',
            mb: 5,
            fontWeight: 400,
            lineHeight: 1.6,
            fontSize: { xs: '1rem', md: '1.25rem' },
          }}
        >
          Built for lifters and athletes. Log sets seamlessly, auto-calculate 1RM records,
          monitor muscle volume, and keep tracking even with zero internet connection.
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mb: 8 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleDemoSignIn}
            endIcon={<ArrowForwardIcon />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.05rem',
              boxShadow: '0 8px 25px rgba(40, 132, 116, 0.4)',
            }}
          >
            Try Live Demo
          </Button>

          <Button
            variant="outlined"
            size="large"
            component={Link}
            href="/register"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.05rem',
            }}
          >
            Create Account
          </Button>
        </Box>

        {/* Feature Cards Grid */}
        <Grid container spacing={3} sx={{ mt: 4, textAlign: 'left' }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', p: 1 }}>
              <CardContent>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    backgroundColor: 'rgba(40, 132, 116, 0.12)',
                    color: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <TimerIcon />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Live Workout Logger
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Dynamic set addition, auto rest-timer with audio cues, plate math calculator, and RPE rating.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', p: 1 }}>
              <CardContent>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    backgroundColor: 'rgba(99, 102, 241, 0.12)',
                    color: '#6366f1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <CloudOffIcon />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Offline First
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Never lose a set. Local persistence keeps your session alive and syncs to cloud automatically.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', p: 1 }}>
              <CardContent>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <ShowChartIcon />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  1RM & Analytics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Automatic Epley 1RM formula calculation, weekly volume trends, and muscle distribution charts.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', p: 1 }}>
              <CardContent>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    backgroundColor: 'rgba(245, 158, 11, 0.12)',
                    color: '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <EmojiEventsIcon />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Badges & PRs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Celebrate personal records, workout streak milestones, and ton-club trophies.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          textAlign: 'center',
          borderTop: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.secondary,
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Webryxon FIT • <a href="https://fit.webryxon.com" target="_blank" rel="noreferrer" style={{ color: theme.palette.primary.main }}>fit.webryxon.com</a>
        </Typography>
      </Box>
    </Box>
  );
}

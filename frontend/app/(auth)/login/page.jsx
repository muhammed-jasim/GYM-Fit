'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  CircularProgress,
  InputAdornment,
  IconButton,
  useTheme,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../../context/AuthContext';
import GoogleAuthButton from '../../../components/auth/GoogleAuthButton';

export default function LoginPage() {
  const router = useRouter();
  const theme = useTheme();
  const { login, demoLogin } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      router.push('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        'Invalid credentials. Please verify your username and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setError('');
    setDemoLoading(true);
    try {
      await demoLogin();
      router.push('/dashboard');
    } catch (err) {
      setError('Could not connect to demo server. Make sure the backend is running.');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 440, width: '100%', p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                backgroundColor: theme.palette.primary.main,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                mb: 1.5,
                boxShadow: '0 4px 14px rgba(40, 132, 116, 0.4)',
              }}
            >
              <FitnessCenterIcon fontSize="medium" />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Sign In to FIT
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your credentials to access your workout logs
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Continue with Google */}
          <Box sx={{ mb: 2.5 }}>
            <GoogleAuthButton
              label="Continue with Google"
              onError={(err) => setError(err.response?.data?.detail || 'Google sign-in failed.')}
            />
          </Box>

          <Divider sx={{ my: 2 }}>
            <Typography variant="caption" color="text.secondary">
              OR WITH EMAIL & USERNAME
            </Typography>
          </Divider>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Username"
              placeholder="e.g. alexrivers"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              autoComplete="username"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              autoComplete="current-password"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              required
            />

            <Box sx={{ textAlign: 'right', mt: 0.5, mb: 2 }}>
              <Link href="/forgot-password" style={{ fontSize: '0.85rem', color: theme.palette.primary.main }}>
                Forgot Password?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || demoLoading}
              sx={{ py: 1.2, mb: 2, fontWeight: 700 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>

          <Divider sx={{ my: 2 }}>
            <Typography variant="caption" color="text.secondary">
              OR TEST INSTANTLY
            </Typography>
          </Divider>

          <Button
            variant="outlined"
            fullWidth
            size="large"
            color="primary"
            startIcon={<PlayArrowIcon />}
            onClick={handleDemoSignIn}
            disabled={loading || demoLoading}
            sx={{ py: 1.2, mb: 2.5, fontWeight: 700 }}
          >
            {demoLoading ? <CircularProgress size={24} color="inherit" /> : '1-Click Demo Login'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don&apos;t have an account?{' '}
              <Link href="/register" style={{ fontWeight: 600, color: theme.palette.primary.main }}>
                Create Account
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

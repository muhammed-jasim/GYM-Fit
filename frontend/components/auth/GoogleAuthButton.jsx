'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.98 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export default function GoogleAuthButton({ label = 'Continue with Google', onSuccess, onError }) {
  const theme = useTheme();
  const router = useRouter();
  const { continueWithGoogle } = useAuth();

  const [loading, setLoading] = useState(false);
  const [devModalOpen, setDevModalOpen] = useState(false);
  const [devEmail, setDevEmail] = useState('athlete.google@webryxon.com');
  const [devName, setDevName] = useState('Google Athlete');

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;

    // Load Google Identity Services script if not already present
    if (!window.google && !document.getElementById('google-gsi-script')) {
      const script = document.createElement('script');
      script.id = 'google-gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initGoogleGsi();
      };
      document.body.appendChild(script);
    } else if (window.google) {
      initGoogleGsi();
    }
  }, [clientId]);

  const initGoogleGsi = () => {
    if (window.google?.accounts?.id && clientId) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
        });
      } catch (err) {
        console.warn('Google GSI initialization warning:', err);
      }
    }
  };

  const handleGoogleResponse = async (response) => {
    if (!response?.credential) return;
    setLoading(true);
    try {
      await continueWithGoogle({ credential: response.credential });
      if (onSuccess) onSuccess();
      else router.push('/dashboard');
    } catch (err) {
      console.error('Google sign in error:', err);
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    // If real Google Client ID is configured, trigger Google prompt
    if (clientId && window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If prompt was skipped or blocked by browser popup settings, fallback to dev modal
          setDevModalOpen(true);
        }
      });
    } else {
      // In local dev without OAuth credentials configured, provide immediate Google test login
      setDevModalOpen(true);
    }
  };

  const handleDevModalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDevModalOpen(false);
    try {
      const names = devName.trim().split(' ');
      const firstName = names[0] || 'Google';
      const lastName = names.slice(1).join(' ') || 'User';

      await continueWithGoogle({
        credential: 'demo-google-token',
        email: devEmail,
        first_name: firstName,
        last_name: lastName,
        avatar: '',
      });
      if (onSuccess) onSuccess();
      else router.push('/dashboard');
    } catch (err) {
      console.error('Dev Google login failed:', err);
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        size="large"
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
        onClick={handleClick}
        disabled={loading}
        sx={{
          py: 1.2,
          fontWeight: 600,
          fontSize: '0.95rem',
          borderRadius: 2.5,
          color: theme.palette.text.primary,
          borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.15)',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#ffffff',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.07)' : '#f8fafc',
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
          },
        }}
      >
        {label}
      </Button>

      {/* Google Account Sign-In Dialog (for local testing & dev) */}
      <Dialog open={devModalOpen} onClose={() => setDevModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <GoogleIcon />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Sign in with Google
          </Typography>
        </DialogTitle>
        <Box component="form" onSubmit={handleDevModalSubmit}>
          <DialogContent dividers>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Choose a Google account to continue to Webryxon FIT.
            </Typography>

            <TextField
              label="Google Email"
              type="email"
              fullWidth
              required
              value={devEmail}
              onChange={(e) => setDevEmail(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Full Name"
              fullWidth
              required
              value={devName}
              onChange={(e) => setDevName(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDevModalOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Continue as Google User
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}

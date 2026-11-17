'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  useTheme,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';

export default function ForgotPasswordPage() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
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
              }}
            >
              <LockResetIcon fontSize="medium" />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Reset Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your registered email address to receive recovery instructions
            </Typography>
          </Box>

          {submitted ? (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              If an account with that email exists, password reset instructions have been sent.
            </Alert>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Email Address"
                placeholder="alex.rivers@example.com"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ py: 1.2, mt: 2, mb: 2, fontWeight: 700 }}
              >
                Send Reset Link
              </Button>
            </Box>
          )}

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link href="/login" style={{ fontSize: '0.9rem', color: theme.palette.primary.main, fontWeight: 600 }}>
              ← Return to Sign In
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

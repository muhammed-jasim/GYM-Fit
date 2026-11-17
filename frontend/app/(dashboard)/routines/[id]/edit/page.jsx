'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import Link from 'next/link';
import RoutineEditor from '../../../../../components/routine/RoutineEditor';
import { routineService } from '../../../../../services/routineService';

export default function EditRoutinePage() {
  const params = useParams();
  const router = useRouter();
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.id) {
      loadRoutine(params.id);
    }
  }, [params.id]);

  const loadRoutine = async (id) => {
    setLoading(true);
    try {
      const data = await routineService.getById(id);
      setRoutine(data);
    } catch (err) {
      console.error('Failed to load routine for editing:', err);
      setError('Could not load routine. It might not exist or you may lack permissions.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error || !routine) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          {error || 'Routine not found'}
        </Typography>
        <Button component={Link} href="/routines" variant="outlined">
          Back to Routines
        </Button>
      </Box>
    );
  }

  return <RoutineEditor initialData={routine} isEdit={true} />;
}

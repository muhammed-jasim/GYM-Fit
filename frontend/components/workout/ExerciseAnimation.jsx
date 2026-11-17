'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, Chip, Tooltip, useTheme } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SpeedIcon from '@mui/icons-material/Speed';
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { getExerciseMediaUrls } from '../../utils/exerciseMedia';

/**
 * ExerciseAnimation: Renders 60FPS hardware-accelerated video demonstration
 * replicating the exact smooth, slow-motion movement demonstration style from Hevy.com.
 * Uses native H.264 MP4 videos with adjustable playbackRate for slow-motion form study.
 */
export default function ExerciseAnimation({
  slug = '',
  exerciseName = '',
  animationType = 'bench_press',
  primaryMuscle = 'Chest',
  equipment = 'Barbell',
  height = 320,
  autoPlay = true,
  interactive = true,
}) {
  const theme = useTheme();
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [speed, setSpeed] = useState(0.75); // 0.75x slow-motion cadence by default
  const [videoError, setVideoError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [phase, setPhase] = useState('down'); // 'down' (eccentric) | 'up' (concentric)

  const media = getExerciseMediaUrls(slug || exerciseName);

  // Sync playback speed whenever speed or video changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  }, [speed, isLoaded]);

  // Sync play/pause state
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  // Cadence tracker synced with slow tempo (eccentric vs concentric)
  useEffect(() => {
    if (!isPlaying) return;
    let timer1, timer2;
    let mounted = true;

    // Total cycle duration scaled by speed (at 0.75x: ~3.8s loop)
    const eccentricTime = Math.round(2200 / speed);
    const concentricTime = Math.round(1640 / speed);

    const cycle = () => {
      if (!mounted) return;
      setPhase('down');
      timer1 = setTimeout(() => {
        if (!mounted) return;
        setPhase('up');
        timer2 = setTimeout(() => {
          if (!mounted) return;
          cycle();
        }, concentricTime);
      }, eccentricTime);
    };

    cycle();

    return () => {
      mounted = false;
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isPlaying, speed]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const cycleSpeed = () => {
    // Cycle between 0.75x (Hevy slow-mo), 0.5x (ultra slow form), 1.0x (normal)
    if (speed === 0.75) setSpeed(1.0);
    else if (speed === 1.0) setSpeed(0.5);
    else setSpeed(0.75);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: height,
        minHeight: height,
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        border: `1.5px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 30px rgba(40, 132, 116, 0.16)',
        },
        '@keyframes tempoPulseSlow': {
          '0%': { transform: 'scale(1)', opacity: 0.9 },
          '50%': { transform: 'scale(1.25)', opacity: 1 },
          '100%': { transform: 'scale(1)', opacity: 0.9 },
        },
        '@keyframes muscleGlow': {
          '0%, 100%': { boxShadow: '0 2px 8px rgba(255, 77, 79, 0.4)' },
          '50%': { boxShadow: '0 2px 18px rgba(255, 77, 79, 0.85)' },
        },
        '@keyframes waveSlideSlow': {
          '0%': { left: '0%', width: '0%' },
          '58%': { left: '0%', width: '100%' },
          '100%': { left: '100%', width: '0%' },
        },
      }}
    >
      {/* 60FPS Hardware-Accelerated Smooth Movement Video */}
      {!videoError ? (
        <Box
          component="video"
          ref={videoRef}
          src={media.mp4Url}
          poster={media.thumbUrl}
          autoPlay={autoPlay}
          loop
          muted
          playsInline
          onLoadedData={() => {
            setIsLoaded(true);
            if (videoRef.current) {
              videoRef.current.playbackRate = speed;
            }
          }}
          onError={() => setVideoError(true)}
          sx={{
            width: '100%',
            height: '100%',
            maxHeight: height,
            objectFit: 'contain',
            p: 1,
            backgroundColor: '#ffffff',
            display: 'block',
          }}
        />
      ) : (
        /* Fallback to GIF or static thumbnail */
        <Box
          component="img"
          src={isPlaying ? media.gifUrl : media.thumbUrl}
          alt={exerciseName || 'Exercise Movement'}
          sx={{
            width: '100%',
            height: height,
            maxHeight: height,
            objectFit: 'contain',
            p: 1.5,
          }}
        />
      )}

      {/* Floating Badges (Top-Left): Muscle & Equipment */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          display: 'flex',
          gap: 1,
          zIndex: 10,
        }}
      >
        <Chip
          label={primaryMuscle}
          size="small"
          sx={{
            fontWeight: 800,
            fontSize: '0.72rem',
            backgroundColor: '#ff4d4f',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(255, 77, 79, 0.4)',
            animation: isPlaying ? 'muscleGlow 3.8s infinite ease-in-out' : 'none',
          }}
        />
        <Chip
          label={equipment}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: '0.72rem',
            backgroundColor: 'rgba(40, 132, 116, 0.95)',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(40, 132, 116, 0.3)',
          }}
        />
      </Box>

      {/* Interactive Controls Overlay (Bottom-Right) */}
      {interactive && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 0.6,
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(8px)',
            borderRadius: 2,
            p: 0.5,
            zIndex: 10,
            boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
          }}
        >
          {/* Play/Pause Button */}
          <Tooltip title={isPlaying ? 'Pause Movement' : 'Play Movement'}>
            <IconButton size="small" onClick={togglePlay} sx={{ color: '#fff', p: 0.5 }}>
              {isPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          {/* Speed Toggle Button (0.75x Slow-Mo, 1.0x Normal, 0.5x Deep Focus) */}
          <Tooltip title="Click to change playback speed">
            <Chip
              icon={<SlowMotionVideoIcon sx={{ fontSize: '14px !important', color: '#10b981 !important' }} />}
              label={`${speed}x ${speed < 1 ? 'Slow' : 'Normal'}`}
              size="small"
              onClick={cycleSpeed}
              clickable
              sx={{
                height: 24,
                fontSize: '0.68rem',
                fontWeight: 800,
                backgroundColor: 'rgba(16, 185, 129, 0.18)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(16, 185, 129, 0.3)',
                },
              }}
            />
          </Tooltip>
        </Box>
      )}

      {/* Live Cadence Rhythm Bar & Dot (Bottom-Left) */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          zIndex: 10,
          backgroundColor: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(8px)',
          py: 0.4,
          px: 1.2,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 0.8,
          boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: phase === 'down' ? '#38bdf8' : '#10b981',
            boxShadow: phase === 'down' ? '0 0 8px #38bdf8' : '0 0 8px #10b981',
            animation: isPlaying ? 'tempoPulseSlow 1.9s infinite ease-in-out' : 'none',
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.68rem',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}
        >
          {isPlaying
            ? phase === 'down'
              ? 'Slow Lower (Eccentric)'
              : 'Smooth Drive (Concentric)'
            : 'Tempo: 2.2s Down • 1.6s Drive'}
        </Typography>
      </Box>

      {/* Fluid Rhythm Wave Underline */}
      {isPlaying && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            backgroundColor: 'rgba(40, 132, 116, 0.15)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              height: '100%',
              backgroundColor: theme.palette.primary.main,
              boxShadow: `0 0 10px ${theme.palette.primary.main}`,
              animation: `waveSlideSlow ${(3.84 / speed).toFixed(2)}s infinite ease-in-out`,
            }}
          />
        </Box>
      )}
    </Box>
  );
}

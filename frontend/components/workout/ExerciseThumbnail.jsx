'use client';

import React, { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { getExerciseMediaUrls } from '../../utils/exerciseMedia';

/**
 * ExerciseThumbnail: Renders the realistic 3D anatomical thumbnail
 * matching Hevy/Strong/user's reference screenshot with active muscle highlight.
 */
export default function ExerciseThumbnail({
  exercise,
  size = 46,
  onClick = null,
  active = false,
  showGifOnHover = true,
}) {
  const theme = useTheme();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const media = getExerciseMediaUrls(exercise);
  const muscle = exercise?.primary_muscle_group || 'chest';

  // Determine badge color by muscle group
  let muscleColor = '#ff4d4f';
  if (['back', 'lats'].includes(muscle)) muscleColor = '#1890ff';
  else if (['legs', 'quads', 'hamstrings', 'calves'].includes(muscle)) muscleColor = '#52c41a';
  else if (['shoulders'].includes(muscle)) muscleColor = '#fa8c16';
  else if (['arms', 'biceps', 'triceps'].includes(muscle)) muscleColor = '#722ed1';
  else if (['core'].includes(muscle)) muscleColor = '#eb2f96';

  return (
    <Box
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        width: size,
        height: size,
        borderRadius: 2.5,
        backgroundColor: '#ffffff',
        border: `1.5px solid ${active ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.15)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        overflow: 'hidden',
        flexShrink: 0,
        boxShadow: active
          ? `0 0 10px rgba(40, 132, 116, 0.4)`
          : '0 2px 8px rgba(0,0,0,0.25)',
        transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
        '&:hover': onClick
          ? {
              transform: 'scale(1.08)',
              borderColor: theme.palette.primary.main,
              boxShadow: `0 0 12px ${theme.palette.primary.main}`,
            }
          : {},
      }}
    >
      {!imgError && media.slug ? (
        isHovered && showGifOnHover ? (
          <Box
            component="video"
            src={media.mp4Url}
            autoPlay
            loop
            muted
            playsInline
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: 1.5,
              backgroundColor: '#ffffff',
            }}
          />
        ) : (
          <Box
            component="img"
            src={media.thumbUrl}
            alt={exercise?.name || 'Exercise'}
            onError={() => setImgError(true)}
            sx={{
              width: '92%',
              height: '92%',
              objectFit: 'contain',
              borderRadius: 1.5,
              backgroundColor: '#ffffff',
            }}
          />
        )
      ) : (
        <FitnessCenterIcon sx={{ fontSize: size * 0.55, color: muscleColor }} />
      )}

      {/* Target Muscle Category Glow Indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 2,
          right: 2,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: muscleColor,
          boxShadow: `0 0 6px ${muscleColor}`,
          border: '1.5px solid #ffffff',
          zIndex: 2,
        }}
      />
    </Box>
  );
}

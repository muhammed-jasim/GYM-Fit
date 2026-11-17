import React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { CustomThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { WorkoutTrackingProvider } from '../context/WorkoutTrackingContext';
import RestTimer from '../components/workout/RestTimer';
import '../styles/globals.css';

export const metadata = {
  title: 'FIT | Premium Workout & Fitness Platform by Webryxon',
  description: 'Track workouts, master your routines, monitor 1RM strength progression, and achieve peak physical performance with Webryxon FIT.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: false }}>
          <CustomThemeProvider>
            <AuthProvider>
              <WorkoutTrackingProvider>
                {children}
                <RestTimer />
              </WorkoutTrackingProvider>
            </AuthProvider>
          </CustomThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

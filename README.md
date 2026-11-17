# FIT by Webryxon

> **Product**: FIT  
> **Company**: Webryxon  
> **Production URL**: [fit.webryxon.com](https://fit.webryxon.com)  
> **Primary Brand Color**: `#288474` (Athletic Emerald / Obsidian Dark Theme)

---

## ⚡ Mandatory Technology Stack & Engineering Standards

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript only (`.js` and `.jsx` exclusively — **NO TypeScript**)
- **Component Library**: Material UI (MUI v5/v6) with `@mui/material-nextjs`
- **Styling**: Normal CSS & CSS Modules (**NO Tailwind CSS**, **NO Vite**)
- **State Management**: React Context (`AuthContext`, `ThemeContext`, `WorkoutTrackingContext`)
- **API Client**: Centralized Axios with automatic JWT interceptors and auto-refresh
- **Charts & Analytics**: Recharts (Volume progression, muscle group distribution, 1RM progression)
- **Offline Persistence**: LocalStorage fallback and queued sync via `/api/workouts/sync_batch/`

### Backend
- **Framework**: Python 3 / Django 4.2 / Django REST Framework (DRF)
- **Database**: PostgreSQL (`webryxon_fit`)
- **Authentication**: JWT (SimpleJWT) with access/refresh token rotation
- **Caching**: Redis Cache backend
- **Background Tasks**: Celery configured with Redis broker

---

## 📁 Project Architecture

```
Webryxon Fit/
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.jsx
│   │   │   ├── register/page.jsx
│   │   │   └── forgot-password/page.jsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.jsx
│   │   │   ├── dashboard/page.jsx
│   │   │   ├── workouts/
│   │   │   │   ├── page.jsx
│   │   │   │   ├── active/page.jsx
│   │   │   │   └── [id]/page.jsx
│   │   │   ├── exercises/page.jsx
│   │   │   ├── routines/
│   │   │   │   ├── page.jsx
│   │   │   │   └── [id]/page.jsx
│   │   │   ├── progress/page.jsx
│   │   │   ├── schedule/page.jsx
│   │   │   └── profile/page.jsx
│   │   ├── layout.jsx
│   │   └── page.jsx
│   ├── components/
│   │   ├── layout/ (Navbar, Sidebar, BottomNav)
│   │   ├── common/ (StatCard, ConfirmDialog)
│   │   └── workout/ (RestTimer, PlateCalculator, ExerciseSelector)
│   ├── context/ (AuthContext, ThemeContext, WorkoutTrackingContext)
│   ├── services/ (api, authService, workoutService, exerciseService, routineService, analyticsService, measurementService, achievementService, offlineStorage)
│   ├── utils/ (calculations, constants, formatters)
│   ├── styles/ (globals.css, theme.js)
│   └── package.json
│
└── backend/
    ├── config/ (settings.py, urls.py, wsgi.py, asgi.py, celery.py)
    ├── apps/
    │   ├── accounts/ (UserProfile, registration, JWT auth, demo login)
    │   ├── exercises/ (Exercise library, muscle groups, equipment, custom movements)
    │   ├── routines/ (Routine splits, RoutineDay, RoutineExercise)
    │   ├── workouts/ (Workout, WorkoutSet, live metrics, batch sync)
    │   ├── analytics/ (PersonalRecord, Epley 1RM math, weekly volume, dashboard summaries)
    │   ├── measurements/ (BodyMeasurement, weight trends, body fat tracking)
    │   └── achievements/ (12 Milestones, automated evaluation, badge shelf)
    ├── requirements.txt
    └── manage.py
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup & Run

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### 2. Frontend Setup & Run

```bash
cd frontend
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Access

- **One-Click Demo**: Click **"1-Click Demo Login"** on the landing page or login screen.
- **Username**: `demo`
- **Password**: `demo12345`

---

## 🏋️ Key Features

1. **Interactive Live Workout Logger (`/workouts/active`)**:
   - Real-time elapsed workout timer
   - Auto-rest countdown timer with audible cue and quick +30s extensions
   - Barbell plate loading calculator modal (with visual rack loading guide)
   - Dynamic set addition, set types (Normal, Warmup, Drop, Failure), and RPE scale (1-10)
   - Real-time Epley 1RM formula calculation per set
   - Offline persistence (`localStorage`) with automatic online batch synchronization

2. **Exercise Library (`/exercises`)**:
   - Filter by muscle group (Chest, Back, Legs, Shoulders, Arms, Core) and equipment (Barbell, Dumbbell, Cable, Machine, Bodyweight)
   - Technique execution cues and coach tips
   - Personal PR history on each movement
   - Custom exercise creation

3. **Routine Splits (`/routines`)**:
   - Pre-loaded template splits (Push / Pull / Legs, Upper / Lower 4-Day)
   - One-click routine cloning to user account
   - Instant "Start Workout from Day X" programming

4. **Analytics & Progress (`/progress`)**:
   - Recharts 1RM and Heaviest Weight progression curves
   - Body weight and body fat trend lines
   - Measurement logs (chest, waist, biceps, thigh)
   - Personal records trophy list

5. **Badges & Achievements (`/profile`)**:
   - 12 unlockable milestone badges across workouts, total volume tonnage, and strength feats

import { lazy } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import { AppLayout } from '@/components/navigation/AppLayout';
import Dashboard from '@/pages/Dashboard';

// Code-split every page except the dashboard for a fast first load.
const Learning = lazy(() => import('@/pages/Learning'));
const OpenWater = lazy(() => import('@/pages/OpenWater'));
const LessonPage = lazy(() => import('@/pages/LessonPage'));
const AdvancedOpenWater = lazy(() => import('@/pages/AdvancedOpenWater'));
const Specialties = lazy(() => import('@/pages/Specialties'));
const SpecialtyPage = lazy(() => import('@/pages/SpecialtyPage'));
const Quiz = lazy(() => import('@/pages/Quiz'));
const DiveReadiness = lazy(() => import('@/pages/DiveReadiness'));
const DivePlanner = lazy(() => import('@/pages/DivePlanner'));
const Weather = lazy(() => import('@/pages/Weather'));
const DiveShops = lazy(() => import('@/pages/DiveShops'));
const MarineLife = lazy(() => import('@/pages/MarineLife'));
const Profile = lazy(() => import('@/pages/Profile'));
const Settings = lazy(() => import('@/pages/Settings'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Hash routing works on GitHub Pages without server rewrites (deep links and refreshes never 404).
export const routes = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'learn', element: <Learning /> },
      { path: 'open-water', element: <OpenWater /> },
      { path: 'open-water/:lessonId', element: <LessonPage /> },
      { path: 'advanced-open-water', element: <AdvancedOpenWater /> },
      { path: 'advanced-open-water/:moduleId', element: <AdvancedOpenWater /> },
      { path: 'specialties', element: <Specialties /> },
      { path: 'specialties/:specialtyId', element: <SpecialtyPage /> },
      { path: 'quiz', element: <Quiz /> },
      { path: 'readiness', element: <DiveReadiness /> },
      { path: 'planner', element: <DivePlanner /> },
      { path: 'weather', element: <Weather /> },
      { path: 'dive-shops', element: <DiveShops /> },
      { path: 'marine-life', element: <MarineLife /> },
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];

const router = createHashRouter(routes, {
  future: { v7_relativeSplatPath: true, v7_fetcherPersist: true, v7_normalizeFormMethod: true, v7_partialHydration: true, v7_skipActionErrorRevalidation: true },
});

export default function App() {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </MotionConfig>
    </ThemeProvider>
  );
}

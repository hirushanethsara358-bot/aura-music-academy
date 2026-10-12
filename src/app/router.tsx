import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ErrorBoundary, LoadingState } from '../components/feedback/Feedback';
import { NotFoundPage, PermissionDeniedPage } from '../features/courses/NotFoundPage';
import { HomePage } from '../features/courses/HomePage';
import { AdminRoute, ProtectedRoute } from '../features/auth/RouteGuards';

/* Route-level code splitting keeps the initial bundle small on modest devices. */
const LearningPathsPage = lazy(() =>
  import('../features/courses/LearningPathsPage').then((m) => ({ default: m.LearningPathsPage }))
);
const LevelPage = lazy(() =>
  import('../features/courses/LevelPage').then((m) => ({ default: m.LevelPage }))
);
const CategoryPage = lazy(() =>
  import('../features/courses/CategoryPage').then((m) => ({ default: m.CategoryPage }))
);
const AboutPage = lazy(() =>
  import('../features/courses/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const LessonDetailPage = lazy(() =>
  import('../features/lessons/LessonDetailPage').then((m) => ({ default: m.LessonDetailPage }))
);
const GlossaryPage = lazy(() =>
  import('../features/lessons/GlossaryPage').then((m) => ({ default: m.GlossaryPage }))
);
const SearchResultsPage = lazy(() =>
  import('../features/lessons/SearchResultsPage').then((m) => ({ default: m.SearchResultsPage }))
);
const LabsPage = lazy(() =>
  import('../features/music-lab/LabsPage').then((m) => ({ default: m.LabsPage }))
);
const MyLearningPage = lazy(() =>
  import('../features/progress/MyLearningPage').then((m) => ({ default: m.MyLearningPage }))
);
const AdminCmsPage = lazy(() =>
  import('../features/admin/AdminCmsPage').then((m) => ({ default: m.AdminCmsPage }))
);
const LoginPage = lazy(() =>
  import('../features/auth/AuthPages').then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import('../features/auth/AuthPages').then((m) => ({ default: m.RegisterPage }))
);
const ForgotPasswordPage = lazy(() =>
  import('../features/auth/AuthPages').then((m) => ({ default: m.ForgotPasswordPage }))
);

function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<LoadingState />}>{node}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <AppLayout />
      </ErrorBoundary>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'learning-paths', element: withSuspense(<LearningPathsPage />) },
      { path: 'levels/:level', element: withSuspense(<LevelPage />) },
      { path: 'category/:category', element: withSuspense(<CategoryPage />) },
      { path: 'lessons/:slug', element: withSuspense(<LessonDetailPage />) },
      { path: 'labs', element: withSuspense(<LabsPage />) },
      { path: 'glossary', element: withSuspense(<GlossaryPage />) },
      { path: 'search', element: withSuspense(<SearchResultsPage />) },
      { path: 'about', element: withSuspense(<AboutPage />) },
      { path: 'login', element: withSuspense(<LoginPage />) },
      { path: 'register', element: withSuspense(<RegisterPage />) },
      { path: 'forgot-password', element: withSuspense(<ForgotPasswordPage />) },
      {
        path: 'my-learning',
        element: withSuspense(
          <ProtectedRoute>
            <MyLearningPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: withSuspense(
          <AdminRoute>
            <AdminCmsPage />
          </AdminRoute>
        ),
      },
      { path: 'forbidden', element: <PermissionDeniedPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

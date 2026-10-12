import { AuthProvider } from '../hooks/useAuth';
import { ErrorBoundary } from '../components/feedback/Feedback';
import { AppRouter } from './router';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ErrorBoundary>
  );
}

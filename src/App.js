// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import { useAuth, AuthProvider } from './context/AuthContext';
import { useWebSocket } from './context/WebSocketContext';
import { CourseProvider } from './context/CourseContext';
import ErrorFallback from './components/ui/ErrorFallback';
import Loader from './components/ui/Loader';
import AuthLayout from './components/layout/AuthLayout';
import AppLayout from './components/layout/AppLayout';
import Landing from './pages/public/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import TeacherDashboard from './pages/dashboard/TeacherDashboard';
import CourseDetail from './pages/dashboard/CourseDetail';
import CourseEditor from './pages/dashboard/CourseEditor';
import Uploads from './pages/dashboard/Uploads';
import Settings from './pages/dashboard/Settings';
import NotFound from './pages/dashboard/NotFound';
import AdminDashboard from './pages/admin/AdminDashboard';
import RealTimeUpdates from './components/dashboard/RealTimeUpdates';

// WebSocket status indicator component
const WebSocketStatus = () => {
  const { isConnected } = useWebSocket();
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
           title={isConnected ? 'WebSocket Connected' : 'WebSocket Disconnected'} />
    </div>
  );
};

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return (
    <AppLayout>
      {children}
      <RealTimeUpdates /> {/* Add real-time updates to all protected routes */}
      <WebSocketStatus /> {/* Add connection indicator */}
    </AppLayout>
  );
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    const redirectPath = user.role === 'teacher' ? '/teacher' 
                      : user.role === 'admin' ? '/admin' 
                      : '/student';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <AuthLayout>{children}</AuthLayout>;
};

function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              style: {
                background: '#4BB543',
              },
            },
            error: {
              duration: 5000,
              style: {
                background: '#FF3333',
              },
            },
          }}
        />
        
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            
            {/* Authentication Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Login />
                  </ErrorBoundary>
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Register />
                  </ErrorBoundary>
                </PublicRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute roles={['student']}>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <StudentDashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />

            {/* Teacher Routes */}
            <Route
              path="/teacher"
              element={
                <ProtectedRoute roles={['teacher', 'admin']}>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <TeacherDashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['admin']}>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <AdminDashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            
            {/* Common Protected Routes */}
            <Route
              path="/courses/:id"
              element={
                <ProtectedRoute>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <CourseDetail />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/create"
              element={
                <ProtectedRoute roles={['teacher', 'admin']}>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <CourseEditor />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
              path="/uploads"
              element={
                <ProtectedRoute roles={['teacher', 'admin']}>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Uploads />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Settings />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />

            {/* Error Routes */}
            <Route path="/not-authorized" element={<NotAuthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CourseProvider>
    </AuthProvider>
  );
}

function NotAuthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">403 - Not Authorized</h1>
        <p>You don't have permission to access this page.</p>
      </div>
    </div>
  );
}

export default App;
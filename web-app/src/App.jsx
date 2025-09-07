import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext'; // ✅ ADD useAuth import
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import LearningPage from './components/learning/LearningPage';
import ContentViewer from './components/learning/ContentViewer';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import { AnalyticsProvider } from './context/AnalyticsContext';
import { NotificationProvider } from './context/NotificationContext';
import { GamificationProvider } from './context/GamificationContext';
import SyllabusManager from './components/learning/SyllabusManager';

// Your NotFoundPage component...
const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8">
          Sorry, the page you are looking for doesn't exist.
        </p>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          🏠 Go to Dashboard
        </button>
      </div>
    </div>
  );
};

// ✅ Fixed: Now useAuth is imported and available
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <AuthProvider> {/* ✅ Make sure AuthProvider wraps everything */}
      <AnalyticsProvider>
        <NotificationProvider>
          <GamificationProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route 
                    path="/login" 
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    } 
                  />
                  <Route 
                    path="/register" 
                    element={
                      <PublicRoute>
                        <Register />
                      </PublicRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/learning" 
                    element={
                      <ProtectedRoute>
                        <LearningPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/content/:contentId" 
                    element={
                      <ProtectedRoute>
                        <ContentViewer />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/analytics" 
                    element={
                      <ProtectedRoute>
                        <AnalyticsDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/syllabus" 
                    element={
                      <ProtectedRoute>
                        <SyllabusManager />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      style: {
                        background: '#10B981',
                      },
                    },
                    error: {
                      style: {
                        background: '#EF4444',
                      },
                    },
                  }}
                />
              </div>
            </Router>
          </GamificationProvider>
        </NotificationProvider>
      </AnalyticsProvider>
    </AuthProvider>
  );
}

export default App;

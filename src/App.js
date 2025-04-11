import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './contexts/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import DocumentsPage from './pages/DocumentsPage';
import LoginPage from './pages/LoginPage';
import './styles.css';
import AddDocumentPage from './pages/AddDocumentPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          
         
          <Route path="/documents" element={ <DocumentsPage />}/>

           {/* Protected routes */}
           <Route 
            path="/add-document" 
            element={
              <ProtectedRoute>
                <AddDocumentPage />
              </ProtectedRoute>
            } 
          />

          <Route
            path="/reset-password"
            element={
              <ProtectedRoute>
                <ResetPasswordPage />
              </ProtectedRoute>
            }
          />

        </Routes>

      </Router>
    </AuthProvider>
  );
}

export default App;

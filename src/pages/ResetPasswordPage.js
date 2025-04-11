// src/pages/ResetPasswordPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../data/supabaseClient';
import { useAuth } from '../contexts/AuthContext'; // Import your auth context
import './LoginPage.css'; // Reusing the same CSS

function ResetPasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [resetComplete, setResetComplete] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the current user from your auth context
  
  // Redirect to login if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setMessage('Nieuwe wachtwoorden komen niet overeen');
      setMessageType('error');
      return;
    }
    
    // Validate password length
    if (newPassword.length < 6) {
      setMessage('Het nieuwe wachtwoord moet minstens 6 tekens lang zijn');
      setMessageType('error');
      return;
    }
    
    try {
      setLoading(true);
      setMessage('');
      setMessageType('');
      
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      
      if (signInError) throw new Error('Huidig wachtwoord is onjuist');
      
      // Then update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) throw updateError;
      
      // Success
      setResetComplete(true);
      setMessage('Je wachtwoord is succesvol bijgewerkt!');
      setMessageType('success');
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // If not logged in, don't render the form (useEffect will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {resetComplete ? (
          <>
            <h1 className="login-title">Wachtwoord bijgewerkt</h1>
            <p>Doorverwijzen naar startpagina...</p>
            <Link to="/" className="login-button" style={{ display: 'inline-block', marginTop: '20px', textDecoration: 'none' }}>
              Go to Home
            </Link>
          </>
        ) : (
          <>
            <h1 className="login-title">Wachtwoord Resetten</h1>
            
            <form onSubmit={handleResetPassword} className="login-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Huidig wachtwoord</label>
                <input
                  id="currentPassword"
                  type="password"
                  placeholder="Voer uw huidige wachtwoord in"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">Nieuw wachtwoord</label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="Nieuw wachtwoord invoeren"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="form-input"
                  minLength="6"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Nieuw wachtwoord bevestigen</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Nieuw wachtwoord bevestigen"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading} 
                className="login-button"
              >
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  'Update Wachtwoord'
                )}
              </button>
            </form>
            
         
          </>
        )}
        
        {message && (
          <div className={`message-container ${messageType}`}>
            <p className="message-text">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;

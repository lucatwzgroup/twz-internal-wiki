// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setMessage('');
      setMessageType('');
      
      const { error } = await signIn(email, password);
      
      if (error) throw error;
      
      navigate('/');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to continue to your account</p>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              'Sign In'
            )}
          </button>
        </form>
        
        {message && (
          <div className={`message-container ${messageType}`}>
            <p className="message-text">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;

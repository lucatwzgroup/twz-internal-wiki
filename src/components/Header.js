import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logoImage from '../data/logo.png';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchParam = queryParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (location.pathname !== '/all-documents') {
      navigate(`/all-documents?search=${encodeURIComponent(query)}`);
    } else {
      const queryParams = new URLSearchParams(location.search);
      if (query.trim()) {
        queryParams.set('search', query);
      } else {
        queryParams.delete('search');
      }
      
      navigate({
        pathname: '/all-documents',
        search: queryParams.toString()
      }, { replace: true });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header>
      <div className="container header-content">
        <div className="logo">
          <div className="logo-icon">
            <img src={logoImage} alt="Logo" className="logo-image" />
          </div>
          <h1>TWZ Wiki</h1>
        </div>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Zoek naar handleidingen..." 
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="auth-buttons">
          {user ? (
            <div className="user-menu">
              <span className="user-email">{user.email}</span>
              <button onClick={handleLogout} className="logout-button">Uitloggen</button>
            </div>
          ) : (
            <Link to="/login" className="login-button">Inloggen</Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

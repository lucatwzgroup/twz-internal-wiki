import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logoImage from '../data/logo.png';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.user-menu-container')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (location.pathname !== '/documents') {
      navigate(`/documents?search=${encodeURIComponent(query)}`);
    } else {
      const queryParams = new URLSearchParams(location.search);
      if (query.trim()) {
        queryParams.set('search', query);
      } else {
        queryParams.delete('search');
      }
      
      navigate({
        pathname: '/documents',
        search: queryParams.toString()
      }, { replace: true });
    }
  };

  const handleLogout = async () => {
    await signOut();
    setMenuOpen(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header>
      <div className="container header-content">
        <Link to="/" className="logo-link">
          <div className="logo">
            <div className="logo-icon">
              <img src={logoImage} alt="Logo" className="logo-image" />
            </div>
            <h1>TWZ Wiki</h1>
          </div>
        </Link>
        
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Zoek naar handleidingen..." 
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="user-section">
          {user ? (
            <div className="user-menu-container">
              <button onClick={toggleMenu} className="user-icon-button">
                <div className="user-icon">
                  {user.email.charAt(0).toUpperCase()}
                </div>
              </button>
              {menuOpen && (
                <div className="dropdown-menu">
                  <div className="user-email">{user.email}</div>
                  <Link to="/add-document" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    Document Toevoegen
                  </Link>
                  <Link to="/reset-password" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    Wachtwoord Resetten
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item logout-item">
                    Uitloggen
                  </button>
                </div>
              )}
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

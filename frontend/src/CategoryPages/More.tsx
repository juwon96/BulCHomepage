import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryPages.css';

const MorePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="app">
      <header className="header visible">
        <div className="header-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src="/logo_transparent.png" alt="METEOR" className="header-logo-img" />
          <span className="header-logo-text">METEOR</span>
        </div>
        <div className="header-right">
          <button className="login-btn" onClick={() => navigate('/login')}>
            <svg className="login-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="page-container">
          <h1 className="page-title">More...</h1>
        </div>
      </main>
    </div>
  );
};

export default MorePage;

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';
import LoginPage from './Login/Login';

// 메인 페이지 컴포넌트
const MainPage: React.FC = () => {
  const [phase, setPhase] = useState<'logo' | 'header' | 'slogan' | 'complete'>('logo');
  const navigate = useNavigate();

  useEffect(() => {
    const headerTimer = setTimeout(() => {
      setPhase('header');
    }, 1000);

    const sloganTimer = setTimeout(() => {
      setPhase('slogan');
    }, 2000);

    const completeTimer = setTimeout(() => {
      setPhase('complete');
    }, 4000);

    return () => {
      clearTimeout(headerTimer);
      clearTimeout(sloganTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  const handleLogoClick = () => {
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="app">
      {/* 인트로 로고 (0-1초: 중앙에 표시 후 페이드아웃) */}
      <div className={`intro-logo-overlay ${phase === 'logo' ? 'visible' : ''}`}>
        <div className="intro-logo-wrapper">
          <img src="/logo_transparent.png" alt="METEOR" className="intro-logo-img" />
          <span className="intro-logo-text">METEOR</span>
        </div>
      </div>

      {/* 헤더 (1초부터 표시) */}
      <header className={`header ${phase !== 'logo' ? 'visible' : ''}`}>
        <div className="header-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
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

      {/* 문구 (2-4초: 페이드인 후 페이드아웃) */}
      <div className={`slogan-overlay ${phase === 'slogan' ? 'visible' : ''}`}>
        <div className="slogan-content">
          <p><span className="text-fire">화재</span>를 예측하고</p>
          <p>생명을 구합니다</p>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <main className="main-content">
        <div className={`category-container ${phase === 'complete' ? 'visible' : ''}`}>
          <div className="category-card" onClick={() => navigate('/meteor')}>
            <span className="category-name">Meteor</span>
          </div>
          <div className="category-card" onClick={() => navigate('/bulc')}>
            <span className="category-name">BulC</span>
          </div>
          <div className="category-card" onClick={() => navigate('/vr')}>
            <span className="category-name">VR</span>
          </div>
          <div className="category-card" onClick={() => navigate('/More...')}>
            <span className="category-name">More...</span>
          </div>
        </div>
      </main>
    </div>
  );
};

// App 라우터
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

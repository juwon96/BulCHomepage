import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryPages.css';
import HeroSection from './HeroSection';

const BulCPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('simulator');
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // 메뉴 외부 클릭 감지
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="app">
      <header className="header visible">
        <div className="header-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src="/logo_transparent.png" alt="METEOR" className="header-logo-img" />
          <span className="header-logo-text">METEOR</span>
        </div>
        <div className="header-right">
          <div className="menu-container" ref={menuRef}>
            <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="menu-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {menuOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={() => { navigate('/login'); setMenuOpen(false); }}>
                  <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>로그인</span>
                </div>
                <div className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>언어 설정</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 서브 메뉴 */}
      <nav className="sub-nav">
        <div className="sub-nav-left">
          <div
            className={`sub-nav-item ${activeMenu === 'simulator' ? 'active' : ''}`}
            onClick={() => setActiveMenu('simulator')}
          >
            체험 시뮬레이터
          </div>
          <div
            className={`sub-nav-item ${activeMenu === 'education' ? 'active' : ''}`}
            onClick={() => setActiveMenu('education')}
          >
            교육 과정
          </div>
          <div
            className={`sub-nav-item ${activeMenu === 'diagnosis' ? 'active' : ''}`}
            onClick={() => setActiveMenu('diagnosis')}
          >
            안전 진단
          </div>
          <div
            className={`sub-nav-item ${activeMenu === 'verification' ? 'active' : ''}`}
            onClick={() => setActiveMenu('verification')}
          >
            효과 검증
          </div>
        </div>
        <div className="sub-nav-right">
          <div className="sub-nav-item contact">
            체험 문의하기
          </div>
        </div>
      </nav>

      <main className="main-content sub-page">
        {activeMenu === 'simulator' && <HeroSection />}
        {activeMenu === 'education' && (
          <div className="page-container">
            <h1 className="page-title">BulC</h1>
            <p className="page-subtitle">교육 과정</p>
          </div>
        )}
        {activeMenu === 'diagnosis' && (
          <div className="page-container">
            <h1 className="page-title">BulC</h1>
            <p className="page-subtitle">안전 진단</p>
          </div>
        )}
        {activeMenu === 'verification' && (
          <div className="page-container">
            <h1 className="page-title">BulC</h1>
            <p className="page-subtitle">효과 검증</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BulCPage;

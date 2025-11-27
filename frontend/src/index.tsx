import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const App: React.FC = () => {
  const [phase, setPhase] = useState<'logo' | 'header' | 'slogan' | 'complete'>('logo');

  useEffect(() => {
    // 1초 후: 로고 페이드아웃, 헤더 표시
    const headerTimer = setTimeout(() => {
      setPhase('header');
    }, 1000);

    // 2초 후: 문구 페이드인
    const sloganTimer = setTimeout(() => {
      setPhase('slogan');
    }, 2000);

    // 4초 후: 문구 페이드아웃, 완료
    const completeTimer = setTimeout(() => {
      setPhase('complete');
    }, 4000);

    return () => {
      clearTimeout(headerTimer);
      clearTimeout(sloganTimer);
      clearTimeout(completeTimer);
    };
  }, []);

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
        <div className="header-logo">
          <img src="/logo_transparent.png" alt="METEOR" className="header-logo-img" />
          <span className="header-logo-text">METEOR</span>
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
        {/* 추후 콘텐츠 추가 */}
      </main>
    </div>
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

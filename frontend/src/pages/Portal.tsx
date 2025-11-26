import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Portal.css';

interface CategoryItem {
  id: string;
  title: string;
  description: string;
  link: string;
}

const categories: CategoryItem[] = [
  {
    id: 'meteor',
    title: '메테오',
    description: '화재 시뮬레이션 서비스',
    link: '/meteor',
  },
  {
    id: 'bulc',
    title: '불씨',
    description: 'AI 기반 화재 분석',
    link: '/bulc',
  },
  {
    id: 'vr',
    title: 'VR',
    description: '가상현실 체험',
    link: '/vr',
  },
];

const Portal: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showText, setShowText] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 텍스트 표시
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 300);

    // 페이드아웃 시작
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 3000);

    // 인트로 완료
    const completeTimer = setTimeout(() => {
      setShowIntro(false);
    }, 4000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  return (
    <div className="portal-page">
      {/* 인트로 */}
      {showIntro && (
        <div className={`portal-intro ${fadeOut ? 'fade-out' : ''}`}>
          <div className={`portal-intro-text ${showText ? 'show' : ''}`}>
            <p className="portal-intro-line">화재를 예측하고</p>
            <p className="portal-intro-line">생명을 구합니다</p>
          </div>
        </div>
      )}

      {/* 상단 네비게이션 */}
      <nav className="portal-nav">
        <Link to="/" className="portal-logo">METEOR</Link>
        <Link to="/login" className="portal-user-icon" aria-label="로그인">
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z"/>
          </svg>
        </Link>
      </nav>

      {/* 카테고리 */}
      <section className="portal-category">
        <div className="portal-container">
          <div className="portal-grid">
            {categories.map((item) => (
              <Link to={item.link} key={item.id} className="portal-card">
                <h3 className="portal-card-title">{item.title}</h3>
                <p className="portal-card-desc">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portal;

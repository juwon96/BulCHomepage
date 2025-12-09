import React from 'react';
import './MeteorPages.css';

const BulCHero: React.FC = () => {
  return (
    <>
      {/* HERO SECTION */}
      <section className="bulc-hero">
        <div className="bulc-hero-container">
          <div className="hero-eyebrow">AI FOR GOOD · SIMULATION FOR SAFETY</div>
          <h1 className="hero-title">
            화재를 예측하는<br/>
            <span className="highlight">가장 빠른 시뮬레이터</span>
          </h1>
          <p className="hero-subtitle">
            누구나 쉽고 실수 없이 BUL:C 는 AI 기반 자동 설정과 GPU 가속 기술을 결합하여 기존 대비 3-15배 빠른 화재-피난 시뮬레이션 결과를 제공합니다.
          </p>
          <div className="hero-actions">
            <div className="btn-wrapper">
              <a
                href="https://msimul.sharepoint.com/:f:/s/msteams_8c91f3-2/EtNitiqwxNhEv4gcjBVUaWMBGqIY1zxNdNOwl4IUMSGxwg?e=ENEjWr"
                className="btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                무료 다운로드
              </a>
              <span className="btn-subtitle">30 Days Free</span>
            </div>
            <button className="btn-secondary">구매 및 상담</button>
          </div>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="bulc-video-section">
        <div className="video-wrapper">
          <iframe
            src="https://www.youtube.com/embed/TuIETV5L_IE?autoplay=1&mute=1&controls=1&loop=1&playlist=TuIETV5L_IE&rel=0"
            title="BULC Intro Video"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bulc-stats-section">
        <div className="meteor-container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">50%</div>
              <div className="stat-label">비용 절감</div>
              <div className="stat-description">기존 대비 시뮬레이션 비용 대폭 절감</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10×</div>
              <div className="stat-label">빠른 작업</div>
              <div className="stat-description">AI 기반 자동화로 작업 시간 단축</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">정확도</div>
              <div className="stat-description">FDS 기반 검증된 시뮬레이션</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">프로젝트</div>
              <div className="stat-description">시뮬레이션으로 보호된 시설</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BulCHero;

import React, { useState, useRef, useEffect } from 'react';
import './CategoryPages.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MeteorAbout from './MeteorAbout';
import MeteorSolutions from './MeteorSolutions';
import MeteorAchievements from './MeteorAchievements';
import MeteorInvesting from './MeteorInvesting';

const SUB_NAV_ITEMS = [
  { id: 'menu1', label: 'About' },
  { id: 'menu2', label: 'Solutions' },
  { id: 'menu3', label: 'Achievements' },
  { id: 'menu4', label: 'Investing' },
  { id: 'menu5', label: 'Teams' },
];

const MeteorPage: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>('menu1');
  const menu1Ref = useRef<HTMLDivElement>(null);
  const menu2Ref = useRef<HTMLDivElement>(null);
  const menu3Ref = useRef<HTMLDivElement>(null);
  const menu4Ref = useRef<HTMLDivElement>(null);
  const menu5Ref = useRef<HTMLDivElement>(null);

  // Handle sub-navigation clicks
  const handleSubNavClick = (menuId: string) => {
    setActiveMenu(menuId);

    // Scroll to the corresponding section
    let targetRef = null;
    if (menuId === 'menu1') targetRef = menu1Ref;
    else if (menuId === 'menu2') targetRef = menu2Ref;
    else if (menuId === 'menu3') targetRef = menu3Ref;
    else if (menuId === 'menu4') targetRef = menu4Ref;
    else if (menuId === 'menu5') targetRef = menu5Ref;

    if (targetRef?.current) {
      const headerOffset = 140; // Account for fixed header height
      const elementPosition = targetRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Update active menu based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for better UX

      if (menu5Ref.current && scrollPosition >= menu5Ref.current.offsetTop) {
        setActiveMenu('menu5');
      } else if (menu4Ref.current && scrollPosition >= menu4Ref.current.offsetTop) {
        setActiveMenu('menu4');
      } else if (menu3Ref.current && scrollPosition >= menu3Ref.current.offsetTop) {
        setActiveMenu('menu3');
      } else if (menu2Ref.current && scrollPosition >= menu2Ref.current.offsetTop) {
        setActiveMenu('menu2');
      } else if (menu1Ref.current && scrollPosition >= menu1Ref.current.offsetTop) {
        setActiveMenu('menu1');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app">
      <Header
        showSubNav={true}
        subNavItems={SUB_NAV_ITEMS}
        activeSubNav={activeMenu}
        onSubNavChange={handleSubNavClick}
      />

      <main className="main-content sub-page">
        <div ref={menu1Ref}>
          <MeteorAbout />
        </div>
        <div ref={menu2Ref}>
          <MeteorSolutions />
        </div>
        <div ref={menu3Ref}>
          <MeteorAchievements />
        </div>
        <div ref={menu4Ref}>
          <section className="meteor-section meteor-investing">
            <div className="meteor-container">
              <div className="section-header">
                <div className="section-eyebrow">FINANCIAL OVERVIEW</div>
                <h2 className="section-title">투자 정보</h2>
                <p className="section-description">
                  매출 현황과 미래 전망을 확인하실 수 있습니다.
                </p>
              </div>
              <MeteorInvesting />
            </div>
          </section>
        </div>
        <div ref={menu5Ref}>
          <section className="meteor-section meteor-teams">
            <div className="meteor-container">
              <div className="section-header">
                <div className="section-eyebrow">OUR TEAM</div>
                <h2 className="section-title">팀 소개</h2>
                <p className="section-description">
                  화재 시뮬레이션과 AI 기술 분야의 전문가들이 함께합니다.
                </p>
              </div>

              <div className="teams-grid">
                <div className="team-card">
                  <div className="team-silhouette">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="35" r="20" fill="#C4320A"/>
                      <ellipse cx="50" cy="75" rx="30" ry="25" fill="#C4320A"/>
                    </svg>
                  </div>
                  <h3 className="team-name">대표이사</h3>
                  <p className="team-role">CEO</p>
                  <p className="team-description">공학박사/겸임교수<br/>화재 CFD 전문/기술영업</p>
                </div>

                <div className="team-card">
                  <div className="team-silhouette">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="35" r="20" fill="#C4320A"/>
                      <ellipse cx="50" cy="75" rx="30" ry="25" fill="#C4320A"/>
                    </svg>
                  </div>
                  <h3 className="team-name">기술이사</h3>
                  <p className="team-role">CTO</p>
                  <p className="team-description">AI/ML 연구개발</p>
                </div>

                <div className="team-card">
                  <div className="team-silhouette">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="35" r="20" fill="#C4320A"/>
                      <ellipse cx="50" cy="75" rx="30" ry="25" fill="#C4320A"/>
                    </svg>
                  </div>
                  <h3 className="team-name">수석 엔지니어</h3>
                  <p className="team-role">Lead Engineer</p>
                  <p className="team-description">시뮬레이션 개발/수행</p>
                </div>

                <div className="team-card">
                  <div className="team-silhouette">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="35" r="20" fill="#C4320A"/>
                      <ellipse cx="50" cy="75" rx="30" ry="25" fill="#C4320A"/>
                    </svg>
                  </div>
                  <h3 className="team-name">기술영업</h3>
                  <p className="team-role">Business Development</p>
                  <p className="team-description">전 중앙대 부총장</p>
                </div>

                <div className="team-card">
                  <div className="team-silhouette">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="35" r="20" fill="#C4320A"/>
                      <ellipse cx="50" cy="75" rx="30" ry="25" fill="#C4320A"/>
                    </svg>
                  </div>
                  <h3 className="team-name">회계/영업</h3>
                  <p className="team-role">Accounting & Sales</p>
                  <p className="team-description">정부출연 R&D 관리<br/>회계 영업</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MeteorPage;

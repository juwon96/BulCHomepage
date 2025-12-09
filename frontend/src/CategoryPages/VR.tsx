import React, { useState, useEffect } from 'react';
import './CategoryPages.css';
import './VR.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SUB_NAV_ITEMS = [
  { id: 'demo', label: 'Interactive Demo' },
  { id: 'assessment', label: 'Self Assessment' },
  { id: 'curriculum', label: 'Curriculum' },
  { id: 'contact', label: 'Contact' },
];

const VRPage: React.FC = () => {
  const [dangerLevel, setDangerLevel] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Danger level animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDangerLevel((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Scroll to section handler
  useEffect(() => {
    const handleNavClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const navItem = target.closest('[data-nav-id]');
      if (navItem) {
        const sectionId = navItem.getAttribute('data-nav-id');
        const section = document.getElementById(sectionId || '');
        if (section) {
          e.preventDefault();
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    document.addEventListener('click', handleNavClick);
    return () => document.removeEventListener('click', handleNavClick);
  }, []);

  const scenarios = [
    {
      title: '사무실에서 업무 중 화재 경보가 울렸습니다. 복도로 나가보니 연기가 자욱합니다. 가장 먼저 해야 할 행동은?',
      answers: [
        'A. 젖은 손수건을 찾으려 화장실로 뛰다',
        'B. 벽을 짚고 자세를 낮춰 비상구 방향으로 이동한다',
        'C. 엘리베이터 버튼을 누른다'
      ]
    }
  ];

  const getDangerStatus = () => {
    if (dangerLevel < 25) return { label: 'SAFE', color: '#10b981' };
    if (dangerLevel < 50) return { label: 'CAUTION', color: '#f59e0b' };
    if (dangerLevel < 75) return { label: 'DANGER', color: '#ef4444' };
    return { label: 'FATAL', color: '#dc2626' };
  };

  const status = getDangerStatus();

  return (
    <div className="app">
      <Header showSubNav={true} subNavItems={SUB_NAV_ITEMS} />

      <main className="vr-main">
        {/* Hero Section */}
        <section className="vr-hero">
          <div className="vr-hero-content">
            <div className="vr-hero-left">
              <span className="vr-badge">● NEXT GEN SAFETY TRAINING</span>
              <h1 className="vr-hero-title">
                화재 발생 시<br />
                <span className="vr-highlight">당신의 생존 확률은</span><br />
                얼마나 될까요?
              </h1>
              <p className="vr-hero-description">
                실제 화재 데이터(BULC) 기반의 90% 이상 정밀한 연기 시뮬레이션.
                책으로 배우는 안전이 아닌, 몸이 기억하는 생존 본능을 깨우세요.
              </p>
              <div className="vr-hero-buttons">
                <button className="vr-btn-primary">
                  <span className="vr-btn-icon">👁</span>
                  연기 시뮬레이션 체험
                </button>
                <button className="vr-btn-secondary">
                  <span className="vr-btn-icon">▶</span>
                  데모 영상 보기
                </button>
              </div>
            </div>
            <div className="vr-hero-right">
              <div className="vr-stat-card">
                <div className="vr-stat-visual">
                  <div className="vr-stat-graph">
                    <div className="vr-stat-bar" style={{ height: '60%' }}></div>
                    <div className="vr-stat-bar" style={{ height: '80%' }}></div>
                    <div className="vr-stat-bar" style={{ height: '100%' }}></div>
                  </div>
                  <div className="vr-stat-trend">📈</div>
                </div>
                <div className="vr-stat-info">
                  <div className="vr-stat-label">TRAINING EFFICIENCY</div>
                  <div className="vr-stat-value">275%</div>
                  <div className="vr-stat-sublabel">자신감 상승 효과</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section id="demo" className="vr-demo">
          <div className="vr-container">
            <div className="vr-section-header">
              <span className="vr-section-badge">INTERACTIVE DEMO</span>
              <h2 className="vr-section-title">보이지 않는 공포, 연기</h2>
              <p className="vr-section-description">
                화재 시 가장 큰 위험은 불길이 아니라 '연기'입니다.<br />
                아래 슬라이더를 움직여 <span className="vr-text-highlight">3분 만에 시야가 어떻게 사라지는지</span> 직접 확인해보세요.
              </p>
            </div>

            <div className="vr-demo-container">
              <div className="vr-demo-alert">
                <span className="vr-alert-icon">⚠</span>
                <span className="vr-alert-text">화재 발생 00:00 경과</span>
              </div>

              <div className="vr-demo-view">
                <div
                  className="vr-demo-smoke"
                  style={{ opacity: dangerLevel / 100 }}
                ></div>
              </div>

              <div className="vr-demo-controls">
                <div className="vr-danger-scale">
                  <div className="vr-danger-labels">
                    <span className="vr-danger-label">SAFE</span>
                    <span className="vr-danger-label">CAUTION</span>
                    <span className="vr-danger-label">DANGER</span>
                    <span className="vr-danger-label active">FATAL</span>
                  </div>
                  <div className="vr-danger-track">
                    <div
                      className="vr-danger-indicator"
                      style={{
                        left: `${dangerLevel}%`,
                        backgroundColor: status.color
                      }}
                    ></div>
                    <div
                      className="vr-danger-fill"
                      style={{
                        width: `${dangerLevel}%`,
                        backgroundColor: status.color
                      }}
                    ></div>
                  </div>
                </div>
                <div className="vr-demo-status">
                  현재 상태: 안전 (시야 확보 100%)
                </div>
              </div>

              <p className="vr-demo-note">
                * BULC 시뮬레이터는 실제 유해 먼지 데이터를 기반으로 이 과정을 HMD를 통해 실시간으로 구현합니다.
              </p>
            </div>
          </div>
        </section>

        {/* Self Assessment Section */}
        <section id="assessment" className="vr-assessment">
          <div className="vr-container">
            <div className="vr-assessment-grid">
              <div className="vr-assessment-left">
                <span className="vr-section-badge">SELF ASSESSMENT</span>
                <h2 className="vr-assessment-title">당신의 안전 IQ는?</h2>
                <div className="vr-assessment-description">
                  <p>화재 상황에서의 판단은 0.1초 만에 이루어집니다.</p>
                  <p>간단한 테스트를 통해 당신의 대처 능력을 확인해보세요.</p>
                  <p>대부분의 사람들은 이 테스트에서 <span className="vr-text-danger">실수</span>를 합니다.</p>
                </div>

                <div className="vr-assessment-info">
                  <div className="vr-info-item">
                    <span className="vr-info-icon">❓</span>
                    <span className="vr-info-text">왜 교육이 필요한가요?</span>
                  </div>
                  <div className="vr-info-item active">
                    <span className="vr-info-icon">✓</span>
                    <span className="vr-info-text">
                      <strong>무의식적 반응(Muscle Memory)</strong>을 훈련치 않으면 패닉 상태에서 몸이 굳어버립니다.
                    </span>
                  </div>
                  <div className="vr-info-item active">
                    <span className="vr-info-icon">✓</span>
                    <span className="vr-info-text">
                      이론으로 배운 "낮은 자세"는 실제 연기 속에서 잊혀지기 쉽습니다. VR은 이를 <strong>경험</strong>으로 각인시킵니다.
                    </span>
                  </div>
                </div>
              </div>

              <div className="vr-assessment-right">
                <div className="vr-quiz-card">
                  <div className="vr-quiz-header">
                    <span className="vr-quiz-badge">SCENARIO 01</span>
                    <span className="vr-quiz-counter">1/3</span>
                  </div>
                  <h3 className="vr-quiz-question">
                    {scenarios[currentScenario].title}
                  </h3>
                  <div className="vr-quiz-answers">
                    {scenarios[currentScenario].answers.map((answer, index) => (
                      <button
                        key={index}
                        className={`vr-quiz-answer ${selectedAnswer === index ? 'selected' : ''}`}
                        onClick={() => setSelectedAnswer(index)}
                      >
                        {answer}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum Section */}
        <section id="curriculum" className="vr-curriculum">
          <div className="vr-container">
            <div className="vr-section-header centered">
              <span className="vr-section-badge">CURRICULUM</span>
              <h2 className="vr-section-title">체계적인 3단계 생존 훈련</h2>
              <p className="vr-section-description">
                단순 체험이 아닙니다. 실제 재난 상황의 타임라인에 맞춘 체계적인 교육 프로그램입니다.
              </p>
            </div>

            <div className="vr-curriculum-grid">
              <div className="vr-curriculum-card blue">
                <div className="vr-card-number">01</div>
                <div className="vr-card-icon">🔔</div>
                <h3 className="vr-card-title">상황 인지</h3>
                <p className="vr-card-description">
                  비상벨 소리와 연기를 인지하고, '불이야'를 외쳐 주변에 상황을 전파합니다. 콘텐츠업의 시작을 훈련합니다.
                </p>
                <div className="vr-card-visual">
                  <div className="vr-card-placeholder"></div>
                </div>
              </div>

              <div className="vr-curriculum-card orange">
                <div className="vr-card-number">02</div>
                <div className="vr-card-icon">🔥</div>
                <h3 className="vr-card-title">초기 대응</h3>
                <p className="vr-card-description">
                  소화기 사용법(P.A.S.S)을 가상으로 실습합니다. 실패 시 측적적인 대피 결정을 내리는 판단력을 기릅니다.
                </p>
                <div className="vr-card-visual">
                  <div className="vr-card-placeholder"></div>
                </div>
              </div>

              <div className="vr-curriculum-card green">
                <div className="vr-card-number">03</div>
                <div className="vr-card-icon">⏱</div>
                <h3 className="vr-card-title">피난 탈출</h3>
                <p className="vr-card-description">
                  시야가 차단된 상황에서 자세를 낮추고 벽을 짚으며 우도 비상구를 이동하는 실제 탈출 과정을 경험합니다.
                </p>
                <div className="vr-card-visual">
                  <div className="vr-card-placeholder"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats & CTA Section */}
        <section className="vr-stats">
          <div className="vr-container">
            <div className="vr-stats-content">
              <div className="vr-stats-left">
                <h2 className="vr-stats-title">
                  숫자가 증명하는<br />
                  VR 교육의 효과
                </h2>
                <p className="vr-stats-description">
                  단순한 체험을 넘어 실제 행동 변화로 이어집니다.<br />
                  PwC와 Deloitte의 연구 결과가 이를 뒷받침합니다.
                </p>

                <div className="vr-stats-metrics">
                  <div className="vr-metric-card">
                    <div className="vr-metric-value">4x</div>
                    <div className="vr-metric-label">
                      강의식 교육 대비<br />
                      <strong>높은 집중력</strong>
                    </div>
                  </div>
                  <div className="vr-metric-card">
                    <div className="vr-metric-value">3.75x</div>
                    <div className="vr-metric-label">
                      교육 내용에 대한<br />
                      <strong>정서적 연결감</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="vr-stats-right">
                <div className="vr-grid-visual">
                  <div className="vr-grid-item">
                    <div className="vr-grid-label">Learning Speed</div>
                  </div>
                  <div className="vr-grid-item"></div>
                  <div className="vr-grid-item"></div>
                  <div className="vr-grid-item risk">
                    <div className="vr-risk-icon">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L3 7V12C3 16.55 6.84 20.74 12 22C17.16 20.74 21 16.55 21 12V7L12 2Z" fill="white"/>
                        <path d="M10 17L15 12L10 7V17Z" fill="#C4320A"/>
                      </svg>
                    </div>
                    <div className="vr-risk-label">0% Risk</div>
                    <div className="vr-risk-sublabel">안전보장</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section id="contact" className="vr-cta">
          <div className="vr-container">
            <div className="vr-cta-content">
              <h2 className="vr-cta-title">
                우리 조직의 안전,<br />
                <span className="vr-cta-highlight">지금 준비해야 합니다</span>
              </h2>
              <p className="vr-cta-description">
                삼성전자, GS건설 등 선도 기업들이 선택한 METEOR의 솔루션.<br />
                맞춤형 컨설팅과 브로슈어를 받아보세요.
              </p>
              <div className="vr-cta-buttons">
                <button className="vr-cta-btn primary">무료 상담 신청하기</button>
                <button className="vr-cta-btn secondary">브로슈어 다운로드</button>
              </div>
              <div className="vr-cta-clients">
                <span className="vr-client-logo">SAMSUNG</span>
                <span className="vr-client-logo">GS건설</span>
                <span className="vr-client-logo">POSCO</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default VRPage;

import React from 'react';
import './MeteorPages.css';

const BulCSolutions: React.FC = () => {
  return (
    <>
    {/* Core Technology Image Banner */}
    <section className="core-tech-banner">
      <h2 className="core-tech-main-title">Core Technology</h2>
      <div className="core-tech-images">
        <div className="core-tech-card">
          <div className="core-tech-image">
            <img src="/img/gpu-chip.png" alt="GPU Acceleration" />
          </div>
          <div className="core-tech-content">
            <h3 className="core-tech-title"><span className="core-tech-icon">⊞</span> GPU Acceleration</h3>
            <p className="core-tech-description">
              NVIDIA <span className="highlight-green">AmgX</span> 솔버와 <span className="highlight-red">FireX</span> 기술을 결합하여 기존 CPU 기반 FDS 대비 최대 <strong>10배 이상</strong> 빠른 연산 속도를 제공합니다.
            </p>
            <ul className="core-tech-features">
              <li>Multi-GPU 병렬 연산 지원</li>
              <li>대규모 격자(Mesh) 고속 처리</li>
            </ul>
          </div>
        </div>
        <div className="core-tech-card">
          <div className="core-tech-image">
            <img src="/img/fire-network.png" alt="Massive Scenarios" />
          </div>
          <div className="core-tech-content">
            <h3 className="core-tech-title"><span className="core-tech-icon">⊞</span> Massive Scenarios</h3>
            <p className="core-tech-description">
              가속화된 GPU 엔진을 통해 수천, 수만 개의 다양한 화재 시나리오 케이스를 단기간에 시뮬레이션하여 AI 학습을 위한 <strong>양질의 빅데이터</strong>를 구축합니다.
            </p>
            <ul className="core-tech-features">
              <li>수십건 이상의 화재 시나리오 검토 가능</li>
              <li>고정밀 물리 데이터(온도, 연기) 확보</li>
            </ul>
          </div>
        </div>
        <div className="core-tech-card">
          <div className="core-tech-image">
            <img src="/img/ai-brain.png" alt="AI Real-time Inference" />
          </div>
          <div className="core-tech-content">
            <h3 className="core-tech-title"><span className="core-tech-icon">⚙</span> AI Real-time Inference</h3>
            <p className="core-tech-description">
              <span className="highlight-purple">PINN</span>(물리 정보 신경망) 및 <span className="highlight-purple">DeepONet/PIDON</span> 기술을 적용. 물리 법칙을 이해하는 AI가 실시간급으로 화재 확산을 예측합니다.
            </p>
            <ul className="core-tech-features">
              <li>PDE 기반 물리적 정합성 확보</li>
              <li>추론 시간 0.1초 미만</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* Industry Applications Section */}
    <section className="industry-applications">
      <div className="industry-container">
        <h2 className="industry-main-title">Industry Applications</h2>

        {/* FAB/Battery 방재 시스템 */}
        <div className="industry-card">
          <div className="industry-image">
            <img src="/img/fab-battery-fire.png" alt="FAB/Battery 방재 시스템" />
            <span className="industry-badge critical">CRITICAL</span>
          </div>
          <div className="industry-content">
            <h3 className="industry-title">FAB/Battery 방재 시스템</h3>
            <p className="industry-description">
              연기확산을 <span className="highlight-orange">GPU 기반 FDS-FireX</span> 모델로 빠르게 예상되는 모든 화재 시나리오를 검토해서 최적의 설비 운영 방안을 구체적으로 도출합니다.
            </p>
            <div className="industry-stats">
              <div className="industry-stat">
                <span className="stat-label">Simulation Time</span>
                <span className="stat-value">30 days → <span className="highlight-orange">1 day</span></span>
              </div>
              <div className="industry-stat">
                <span className="stat-label">Accuracy</span>
                <span className="stat-value">98.5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 초고층 빌딩 및 데이터센터 */}
        <div className="industry-card reverse">
          <div className="industry-content">
            <h3 className="industry-title">초고층 빌딩 및 데이터센터</h3>
            <p className="industry-description">
              복잡한 구조의 고층 빌딩이나 데이터센터의 열 유동을 빠르게 모델링하고, 다양한 화재 시나리오를 <span className="highlight-red">Physical AI</span>로 학습하여 <span className="highlight-red">실시간 예측</span> 시스템을 구축합니다.
            </p>
            <div className="industry-stats">
              <div className="industry-stat">
                <span className="stat-label">Simulation Time</span>
                <span className="stat-value">48hr → <span className="highlight-orange">0.5s</span></span>
              </div>
              <div className="industry-stat">
                <span className="stat-label">ML Model</span>
                <span className="stat-value">PINN/PIDON</span>
              </div>
            </div>
          </div>
          <div className="industry-image">
            <img src="/img/building-fire.png" alt="초고층 빌딩 및 데이터센터" />
          </div>
        </div>
      </div>
    </section>

    <section className="meteor-section meteor-solutions">
      <div className="meteor-container">
        <div className="section-header">
          <div className="section-eyebrow">CORE FEATURES</div>
          <h2 className="section-title">BULC 핵심 기능</h2>
          <p className="section-description">
            AI 기반 자동화와 직관적인 인터페이스로 누구나 쉽게 전문적인 화재 시뮬레이션을 수행할 수 있습니다.
          </p>
        </div>

        <div className="solutions-grid">
          <div className="solution-card">
            <h3 className="solution-title">화재-피난 시뮬레이션</h3>
            <p className="solution-description">
              가시도, 온도, 일산화탄소, 열방출률, 유동 패턴 등 핵심 지표를 다각도로 분석하여 화재 위험을 정확하게 평가합니다. 다양한 EVAC 모델을 이용해서 다층 건물의 대피 경로와 탈출 시간을 정확하게 계산합니다.
            </p>
            <div className="solution-video">
              <iframe
                src="https://www.youtube.com/embed/SUwtGhU9mbc"
                title="화재-피난 시뮬레이션"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
            <div className="solution-tags">
              <span className="tag">초고층</span>
              <span className="tag">터널</span>
              <span className="tag">데이터센터</span>
              <span className="tag">물류창고</span>
              <span className="tag">ESS/배터리</span>
              <span className="tag">EVAC</span>
            </div>
          </div>

          <div className="solution-card">
            <h3 className="solution-title">Drag & Drop</h3>
            <p className="solution-description">
              복잡한 코딩 없이 마우스 드래그만으로 건물 구조, 화재원, 센서 등을 직관적으로 배치하고 시뮬레이션을 설정할 수 있습니다.
            </p>
            <div className="solution-video">
              <iframe
                src="https://www.youtube.com/embed/KwZUWgnw540"
                title="Drag & Drop"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
            <div className="solution-tags">
              <span className="tag">직관적 UI</span>
              <span className="tag">빠른 설정</span>
              <span className="tag">3D 미리보기</span>
              <span className="tag">실시간 편집</span>
            </div>
          </div>

          <div className="solution-card">
            <h3 className="solution-title">Fire DB</h3>
            <p className="solution-description">
              실험 기반 검증된 화재 데이터베이스를 통해 다양한 가연물의 연소 특성을 정확하게 반영한 시뮬레이션을 수행합니다.
            </p>
            <div className="solution-video">
              <iframe
                src="https://www.youtube.com/embed/KwZUWgnw540"
                title="Fire DB"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
            <div className="solution-tags">
              <span className="tag">실험 데이터</span>
              <span className="tag">배터리 화재</span>
              <span className="tag">전기차</span>
              <span className="tag">ESS</span>
            </div>
          </div>

          <div className="solution-card">
            <h3 className="solution-title">FDS-AmgX GPU 엔진(Beta)</h3>
            <p className="solution-description">
              GPU를 이용해서 대형 건축물과 공간을 실시간으로 계산하는 엔진입니다. 현재 데이터 전송 최적화 중입니다.
            </p>
            <div className="architecture-diagram">
              <pre>
{`┌─────────────────────────────────────────────────────────────┐
│                    FDS Simulation (Fortran)                 │
│                         main.f90                            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                 Pressure Solver (pres.f90)                  │
│                                                             │
│    ┌─────────────┐                    ┌─────────────┐       │
│    │  CPU Path   │                    │  GPU Path   │       │
│    │ (FFT/ULMAT) │                    │   (AmgX)    │       │
│    └─────────────┘                    └──────┬──────┘       │
└──────────────────────────────────────────────┼──────────────┘
                                               │
                          ┌────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Fortran Interface (amgx_fortran.f90)           │
│                      ISO_C_BINDING                          │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                C Wrapper (amgx_c_wrapper.c)                 │
│           Zone Management, Matrix Conversion                │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    NVIDIA AmgX Library                      │
│              FGMRES Solver + AMG Preconditioner             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      NVIDIA GPU (CUDA)                      │
└─────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>
            <div className="solution-tags">
              <span className="tag">GPU</span>
              <span className="tag">실시간</span>
              <span className="tag">고성능</span>
              <span className="tag">Beta</span>
            </div>
            <div className="opensource-link">
              Open source available: <a href="https://github.com/using76/GPU-FDS-AMGX" target="_blank" rel="noopener noreferrer">https://github.com/using76/GPU-FDS-AMGX</a>
            </div>
          </div>

        </div>
      </div>
    </section>
    </>
  );
};

export default BulCSolutions;

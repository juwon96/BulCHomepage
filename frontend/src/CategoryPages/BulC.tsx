import React, { useState } from 'react';
import './CategoryPages.css';
import Header from '../components/Header';

const SUB_NAV_ITEMS = [
  { id: 'intro', label: '소개' },
  { id: 'features', label: '기능' },
  { id: 'cases', label: '적용 사례' },
  { id: 'inquiry', label: '도입 문의' },
];

const BulCPage: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('intro');

  return (
    <div className="app">
      <Header
        showSubNav={true}
        subNavItems={SUB_NAV_ITEMS}
        activeSubNav={activeMenu}
        onSubNavChange={setActiveMenu}
        contactLabel="도입 문의하기"
      />

      <main className="main-content sub-page">
        {activeMenu === 'intro' && (
          <div className="page-container">
            <h1 className="page-title">BUL:C</h1>
            <p className="page-subtitle">소개</p>
          </div>
        )}
        {activeMenu === 'features' && (
          <div className="page-container">
            <h1 className="page-title">BUL:C</h1>
            <p className="page-subtitle">기능</p>
          </div>
        )}
        {activeMenu === 'cases' && (
          <div className="page-container">
            <h1 className="page-title">BUL:C</h1>
            <p className="page-subtitle">적용 사례</p>
          </div>
        )}
        {activeMenu === 'inquiry' && (
          <div className="page-container">
            <h1 className="page-title">BUL:C</h1>
            <p className="page-subtitle">도입 문의</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BulCPage;

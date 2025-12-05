import React, { useState, useRef, useEffect } from 'react';
import './CategoryPages.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BulCSolutions from './BulCSolutions';

const SUB_NAV_ITEMS = [
  { id: 'menu1', label: '메뉴1' },
  { id: 'menu2', label: '메뉴2' },
  { id: 'menu3', label: '메뉴3' },
  { id: 'menu4', label: '메뉴4' },
];

const BulCPage: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>('menu1');
  const menu1Ref = useRef<HTMLDivElement>(null);
  const menu2Ref = useRef<HTMLDivElement>(null);
  const menu3Ref = useRef<HTMLDivElement>(null);
  const menu4Ref = useRef<HTMLDivElement>(null);

  // Handle sub-navigation clicks
  const handleSubNavClick = (menuId: string) => {
    setActiveMenu(menuId);

    // Scroll to the corresponding section
    let targetRef = null;
    if (menuId === 'menu1') targetRef = menu1Ref;
    else if (menuId === 'menu2') targetRef = menu2Ref;
    else if (menuId === 'menu3') targetRef = menu3Ref;
    else if (menuId === 'menu4') targetRef = menu4Ref;

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

      if (menu4Ref.current && scrollPosition >= menu4Ref.current.offsetTop) {
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
          {/* Menu 1 content */}
        </div>
        <div ref={menu2Ref}>
          <BulCSolutions />
        </div>
        <div ref={menu3Ref}>
          {/* Menu 3 content */}
        </div>
        <div ref={menu4Ref}>
          {/* Menu 4 content */}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BulCPage;

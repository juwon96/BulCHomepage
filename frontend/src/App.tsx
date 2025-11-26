import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/variables.css';
import './App.css';
import Header from './components/Header/Header';
import Portal from './pages/Portal';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* 포털 페이지 - 헤더 없이 독립적으로 표시 */}
        <Route path="/" element={<Portal />} />

        {/* 그 외 페이지 - 헤더 포함 */}
        <Route path="/*" element={
          <div className="App">
            <Header />
            <main>
              <Routes>
                <Route path="/login" element={<Login />} />
              </Routes>
            </main>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;

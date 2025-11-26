import React from 'react';
import './Login.css';

const Login: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 로직 추후 구현
    console.log('로그인 시도');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">로그인</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <button type="submit" className="login-submit">
            로그인
          </button>
        </form>

        <div className="login-links">
          <a href="/signup">회원가입</a>
          <a href="/forgot-password">비밀번호 찾기</a>
        </div>
      </div>
    </div>
  );
};

export default Login;

-- ===============================
-- BulC Homepage Database Initialization
-- PostgreSQL 16
-- ===============================

-- 확장 기능 설치
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===============================
-- 1. users (유저 테이블)
-- ===============================
CREATE TABLE users (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NULL,
    name            VARCHAR(100) NULL,
    phone_number    VARCHAR(50) NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'active',
    role_id         BIGINT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- 2. user_roles (유저 등급 테이블)
-- ===============================
CREATE TABLE user_roles (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    code            VARCHAR(50) NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    description     TEXT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- users FK 추가
ALTER TABLE users ADD CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES user_roles(id);

-- ===============================
-- 3. products (상품 종류 테이블)
-- ===============================
CREATE TABLE products (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    code            VARCHAR(50) NOT NULL UNIQUE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- 4. price_plans (상품 가격 테이블)
-- ===============================
CREATE TABLE price_plans (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_id      BIGINT NOT NULL,
    name            VARCHAR(100) NOT NULL,
    duration_months INT NOT NULL,
    price           DECIMAL(18,2) NOT NULL,
    currency        VARCHAR(10) NOT NULL DEFAULT 'KRW',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_price_plans_product FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ===============================
-- 5. subscriptions (유저 구독 관리 테이블)
-- ===============================
CREATE TABLE subscriptions (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id         BIGINT NOT NULL,
    product_id      BIGINT NOT NULL,
    price_plan_id   BIGINT NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'active',
    start_date      TIMESTAMP NOT NULL,
    end_date        TIMESTAMP NOT NULL,
    auto_renew      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_subscriptions_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_subscriptions_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_subscriptions_price_plan FOREIGN KEY (price_plan_id) REFERENCES price_plans(id)
);

-- ===============================
-- 6. payments (결제 테이블)
-- ===============================
CREATE TABLE payments (
    id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id             BIGINT NOT NULL,
    user_email          VARCHAR(255) NOT NULL,
    user_name           VARCHAR(100) NULL,
    subscription_id     BIGINT NULL,
    price_plan_id       BIGINT NOT NULL,
    amount              DECIMAL(18,2) NOT NULL,
    currency            VARCHAR(10) NOT NULL DEFAULT 'KRW',
    status              VARCHAR(20) NOT NULL DEFAULT 'pending',
    payment_method      VARCHAR(50) NULL,
    payment_provider    VARCHAR(50) NULL,
    transaction_id      VARCHAR(255) NULL,
    paid_at             TIMESTAMP NULL,
    refunded_at         TIMESTAMP NULL,
    refund_amount       DECIMAL(18,2) NULL,
    refund_reason       TEXT NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_payments_subscription FOREIGN KEY (subscription_id) REFERENCES subscriptions(id),
    CONSTRAINT fk_payments_price_plan FOREIGN KEY (price_plan_id) REFERENCES price_plans(id)
);

-- ===============================
-- 7. activity_logs (로그 테이블)
-- ===============================
CREATE TABLE activity_logs (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id         BIGINT NULL,
    action          VARCHAR(50) NOT NULL,
    target_type     VARCHAR(50) NULL,
    target_id       BIGINT NULL,
    description     TEXT NULL,
    ip_address      VARCHAR(50) NULL,
    user_agent      TEXT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_activity_logs_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ===============================
-- 8. user_change_logs (유저 정보 변경 로그 테이블)
-- ===============================
CREATE TABLE user_change_logs (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id         BIGINT NOT NULL,
    changed_field   VARCHAR(100) NOT NULL,
    old_value       TEXT NULL,
    new_value       TEXT NULL,
    changed_by      BIGINT NULL,
    change_reason   TEXT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_change_logs_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_user_change_logs_changed_by FOREIGN KEY (changed_by) REFERENCES users(id)
);

-- ===============================
-- 9. admin_logs (관리자 로그 테이블)
-- ===============================
CREATE TABLE admin_logs (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    admin_id        BIGINT NOT NULL,
    action          VARCHAR(100) NOT NULL,
    target_type     VARCHAR(50) NOT NULL,
    target_id       BIGINT NULL,
    description     TEXT NULL,
    ip_address      VARCHAR(50) NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_admin_logs_admin FOREIGN KEY (admin_id) REFERENCES users(id)
);

-- ===============================
-- 인덱스 정의
-- ===============================

-- users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_role_id ON users(role_id);

-- products
CREATE INDEX idx_products_code ON products(code);
CREATE INDEX idx_products_is_active ON products(is_active);

-- price_plans
CREATE INDEX idx_price_plans_product_id ON price_plans(product_id);
CREATE INDEX idx_price_plans_is_active ON price_plans(is_active);

-- subscriptions
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_product_id ON subscriptions(product_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_end_date ON subscriptions(end_date);

-- payments
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);

-- activity_logs
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- user_change_logs
CREATE INDEX idx_user_change_logs_user_id ON user_change_logs(user_id);
CREATE INDEX idx_user_change_logs_created_at ON user_change_logs(created_at);

-- admin_logs
CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_action ON admin_logs(action);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at);

-- ===============================
-- updated_at 자동 갱신 트리거
-- ===============================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_price_plans_updated_at BEFORE UPDATE ON price_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================
-- 초기 데이터 삽입
-- ===============================

-- 유저 등급 데이터
INSERT INTO user_roles (code, name, description) VALUES
    ('admin', '관리자', '전체 시스템 관리자'),
    ('user', '일반 사용자', '일반 서비스 이용자'),
    ('premium', '프리미엄', '유료 구독 사용자');

-- 상품 데이터
INSERT INTO products (code, name, description, is_active) VALUES
    ('BULC', 'BulC 화재 시뮬레이션', '실제 화재 데이터 기반 연기 시뮬레이션 솔루션', TRUE),
    ('VR_TRAINING', 'VR 안전 교육', 'VR 기반 화재 대피 훈련 프로그램', TRUE);

-- 요금제 데이터 (BULC)
INSERT INTO price_plans (product_id, name, duration_months, price, currency, is_active) VALUES
    (1, '1개월', 1, 99000.00, 'KRW', TRUE),
    (1, '3개월', 3, 267000.00, 'KRW', TRUE),
    (1, '6개월', 6, 474000.00, 'KRW', TRUE),
    (1, '12개월', 12, 828000.00, 'KRW', TRUE);

-- 요금제 데이터 (VR_TRAINING)
INSERT INTO price_plans (product_id, name, duration_months, price, currency, is_active) VALUES
    (2, '1개월', 1, 149000.00, 'KRW', TRUE),
    (2, '3개월', 3, 402000.00, 'KRW', TRUE),
    (2, '6개월', 6, 714000.00, 'KRW', TRUE),
    (2, '12개월', 12, 1248000.00, 'KRW', TRUE);

-- 테스트 사용자 계정 (비밀번호: 1234)
-- BCrypt 해시: $2a$10$N9qo8uLOickgx2ZMRZoMye7EtHGrr8tQKqLF5O.9kYVEJvVVcezDK
INSERT INTO users (email, password_hash, name, phone_number, status, role_id) VALUES
    ('admin@meteor.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye7EtHGrr8tQKqLF5O.9kYVEJvVVcezDK', 'Admin', NULL, 'active', 1),
    ('user@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye7EtHGrr8tQKqLF5O.9kYVEJvVVcezDK', 'Test User', '010-1234-5678', 'active', 2);

-- 초기화 완료 메시지
DO $$
BEGIN
    RAISE NOTICE 'Database initialization completed successfully!';
END $$;

-- ===============================
-- 1) 회원 계정 기본 정보: users
-- ===============================
CREATE TABLE users (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NULL, -- 소셜 로그인만 쓰는 계정은 NULL 가능
    email_verified  BOOLEAN NOT NULL DEFAULT FALSE,

    status          VARCHAR(50) NOT NULL DEFAULT 'active',
    -- 예: 'active', 'suspended', 'deleted'

    sign_up_channel VARCHAR(50) NULL,   -- 'web', 'admin', 'partner' 등
    locale          VARCHAR(10) NULL,   -- 'ko', 'en', 'ja' 등
    timezone        VARCHAR(50) NULL,   -- 'Asia/Seoul' 등

    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- 2) 회원 상세 프로필: user_profiles
-- ===============================
CREATE TABLE user_profiles (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id         BIGINT NOT NULL,
    
    name            VARCHAR(100) NULL,
    phone_number    VARCHAR(50) NULL,
    
    company_name    VARCHAR(255) NULL,
    department      VARCHAR(255) NULL,
    job_title       VARCHAR(255) NULL,
    company_size    VARCHAR(50) NULL,   -- '1-10', '11-50', '50-200' 등

    address_line1   VARCHAR(255) NULL,
    address_line2   VARCHAR(255) NULL,
    city            VARCHAR(100) NULL,
    state           VARCHAR(100) NULL,
    postal_code     VARCHAR(20) NULL,
    country         VARCHAR(100) NULL,

    extra_meta      JSON NULL,          -- 특이 정보(내부 메모 등) 확장용

    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_profiles_user
        FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ===============================
-- 3) 소셜 로그인 / 외부 인증: user_auth_providers
-- ===============================
CREATE TABLE user_auth_providers (
    id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id             BIGINT NOT NULL,

    provider            VARCHAR(50) NOT NULL,
    -- 예: 'google', 'kakao', 'naver', 'github'

    provider_user_id    VARCHAR(255) NOT NULL,
    -- 해당 provider에서의 고유 ID

    access_token        TEXT NULL,
    refresh_token       TEXT NULL,
    token_expires_at    TIMESTAMP NULL,

    raw_profile         JSON NULL,  -- provider에서 받은 원본 프로필

    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_auth_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT uq_provider_user UNIQUE (provider, provider_user_id)
);

-- ===============================
-- 4) 역할 정의: user_roles
-- ===============================
CREATE TABLE user_roles (
    id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    code        VARCHAR(50) NOT NULL UNIQUE,  -- 'admin', 'user', 'partner' 등
    name        VARCHAR(100) NOT NULL,        -- '관리자', '일반 사용자'
    description TEXT NULL
);

-- ===============================
-- 5) 사용자-역할 매핑: user_role_mappings
-- ===============================
CREATE TABLE user_role_mappings (
    id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id     BIGINT NOT NULL,
    role_id     BIGINT NOT NULL,

    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_role_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_role_role
        FOREIGN KEY (role_id) REFERENCES user_roles(id),
    CONSTRAINT uq_user_role UNIQUE (user_id, role_id)
);

-- ===============================
-- 6) 회원 상태 변경 이력: user_status_logs
-- ===============================
CREATE TABLE user_status_logs (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id         BIGINT NOT NULL,
    
    from_status     VARCHAR(50) NULL,
    to_status       VARCHAR(50) NOT NULL,    -- 'active', 'suspended', 'deleted' 등
    reason          TEXT NULL,               -- 내부 메모
    changed_by      BIGINT NULL,             -- 관리자가 바꿨다면 관리자 user_id
    
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_statuslog_user
        FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ===============================
-- 7) 솔루션(상품): products
-- ===============================
CREATE TABLE products (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    code            VARCHAR(50) NOT NULL UNIQUE,    -- 'OPENFIRE', 'BULC' 등
    name            VARCHAR(255) NOT NULL,
    description     TEXT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,

    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- 8) 요금제/가격: price_plans
-- ===============================
CREATE TABLE price_plans (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_id      BIGINT NOT NULL,

    name            VARCHAR(255) NOT NULL,         -- '월간 기본', '연간 프로' 등
    billing_type    VARCHAR(50) NOT NULL,          -- 'one_time', 'recurring'
    billing_period  VARCHAR(50) NULL,              -- 'month', 'year', null(1회 결제)

    amount          DECIMAL(18,2) NOT NULL,
    currency        VARCHAR(10) NOT NULL DEFAULT 'KRW',

    is_active       BOOLEAN NOT NULL DEFAULT TRUE,

    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_price_product
        FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ===============================
-- 9) 구독 정보: subscriptions
-- ===============================
CREATE TABLE subscriptions (
    id                   BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id              BIGINT NOT NULL,
    price_plan_id        BIGINT NOT NULL,

    status               VARCHAR(50) NOT NULL,
    -- 'active', 'canceled', 'expired', 'past_due' 등

    current_period_start TIMESTAMP NOT NULL,
    current_period_end   TIMESTAMP NOT NULL,

    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    canceled_at          TIMESTAMP NULL,

    created_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_sub_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_sub_plan
        FOREIGN KEY (price_plan_id) REFERENCES price_plans(id)
);

-- ===============================
-- 10) 주문: orders
-- ===============================
CREATE TABLE orders (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id         BIGINT NOT NULL,

    order_number    VARCHAR(100) NOT NULL UNIQUE, -- 외부 노출용 주문번호
    status          VARCHAR(50) NOT NULL,         -- 'pending', 'paid', 'canceled', 'failed' 등

    order_type      VARCHAR(50) NOT NULL,         -- 'one_time', 'subscription_initial', 'subscription_renewal'
    total_amount    DECIMAL(18,2) NOT NULL,
    currency        VARCHAR(10) NOT NULL DEFAULT 'KRW',

    note            TEXT NULL,                   -- 내부 메모

    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ===============================
-- 10-1) 주문 항목: order_items
-- ===============================
CREATE TABLE order_items (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    order_id        BIGINT NOT NULL,
    product_id      BIGINT NOT NULL,
    price_plan_id   BIGINT NULL,   -- 1회성 상품이면 NULL 가능

    quantity        INT NOT NULL DEFAULT 1,
    unit_amount     DECIMAL(18,2) NOT NULL,
    total_amount    DECIMAL(18,2) NOT NULL,

    metadata        JSON NULL,     -- 라이선스 수량, 좌석 수 등 확장

    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_orderitems_order
        FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_orderitems_product
        FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_orderitems_priceplan
        FOREIGN KEY (price_plan_id) REFERENCES price_plans(id)
);

-- ===============================
-- 11) 결제: payments
-- ===============================
CREATE TABLE payments (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    order_id        BIGINT NOT NULL,
    user_id         BIGINT NOT NULL,

    provider        VARCHAR(50) NOT NULL,       -- 'toss', 'inicis', 'stripe' 등
    provider_payment_id VARCHAR(255) NOT NULL,  -- PG측 결제 ID

    amount          DECIMAL(18,2) NOT NULL,
    currency        VARCHAR(10) NOT NULL DEFAULT 'KRW',

    status          VARCHAR(50) NOT NULL,       -- 'pending', 'paid', 'failed', 'canceled', 'refunded'
    paid_at         TIMESTAMP NULL,
    failure_reason  TEXT NULL,

    raw_response    JSON NULL,                  -- PG에서 받은 원본 응답

    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payments_order
        FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_payments_user
        FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ===============================
-- 12) 환불: refunds
-- ===============================
CREATE TABLE refunds (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    payment_id      BIGINT NOT NULL,

    refund_amount   DECIMAL(18,2) NOT NULL,
    reason          TEXT NULL,

    status          VARCHAR(50) NOT NULL,       -- 'pending', 'completed', 'failed'
    provider_refund_id VARCHAR(255) NULL,       -- PG 측 환불 ID
    refunded_at     TIMESTAMP NULL,

    raw_response    JSON NULL,                  -- PG 환불 응답 원본

    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_refunds_payment
        FOREIGN KEY (payment_id) REFERENCES payments(id)
);

-- ===============================
-- 13) 사용자 활동 로그: user_activity_logs
-- ===============================
CREATE TABLE user_activity_logs (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id         BIGINT NULL, 

    action          VARCHAR(100) NOT NULL,
    -- 예: 'page_view', 'button_click', 'login', 'logout', 
    --     'subscribe', 'payment_attempt', 'error', 등

    resource_path   VARCHAR(500) NULL,
    -- 웹 URL 또는 API 경로 예: '/pricing', '/api/orders'

    http_method     VARCHAR(10) NULL, 
    -- GET, POST, PUT, DELETE 등

    ip_address      VARCHAR(50) NULL,
    user_agent      TEXT NULL,
    referrer        VARCHAR(500) NULL,

    metadata        JSON NULL,
    -- 동작 관련 상세 정보 (버튼ID, 상품ID, 이전 URL, 에러 내용 등)

    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_activity_user
        FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ===============================
-- 14) 관리자 운영 로그: admin_operation_logs
-- ===============================
CREATE TABLE admin_operation_logs (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    admin_user_id   BIGINT NOT NULL,      -- 관리자 계정 (users.id)
    
    action          VARCHAR(100) NOT NULL,
    -- 예: 'user_suspend', 'subscription_cancel', 
    --     'order_cancel', 'payment_mark_failed', 'refund_create' 등

    target_type     VARCHAR(50) NOT NULL,
    -- 'user', 'subscription', 'order', 'payment', 'refund' 등

    target_id       BIGINT NULL,          -- target_type에 따른 ID
    target_user_id  BIGINT NULL,          -- 관련 유저가 있다면

    description     TEXT NULL,            -- 상세 사유/내용
    ip_address      VARCHAR(50) NULL,
    user_agent      TEXT NULL,

    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_adminlog_admin
        FOREIGN KEY (admin_user_id) REFERENCES users(id),
    CONSTRAINT fk_adminlog_targetuser
        FOREIGN KEY (target_user_id) REFERENCES users(id)
);

-- ===============================
-- 15) 인증/검증: verifications (이메일/전화/SMS/비밀번호 재설정 코드 등 공통)
-- ===============================
CREATE TABLE verifications (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    user_id         BIGINT NULL,
    -- 가입 전 인증 등 user가 없을 수도 있으므로 NULL 허용

    channel         VARCHAR(20) NOT NULL,
    -- 'email', 'phone' 등

    target_value    VARCHAR(255) NOT NULL,
    -- 인증 대상 값 (이메일 주소, 전화번호 등)

    purpose         VARCHAR(50) NOT NULL,
    -- 'signup', 'password_reset', 'login', 'change_contact', '2fa' 등

    code            VARCHAR(50) NOT NULL,
    -- 이메일은 긴 토큰, SMS는 6자리 숫자 등

    expires_at      TIMESTAMP NOT NULL,
    verified_at     TIMESTAMP NULL,

    attempt_count   INT NOT NULL DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- 'pending', 'verified', 'expired', 'canceled'

    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_verifications_user
        FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ===============================
-- 16) 로그인 시도 기록: auth_login_attempts
-- ===============================
CREATE TABLE auth_login_attempts (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id         BIGINT NULL,
    -- 이메일로 사용자 찾지 못한 경우 NULL

    email           VARCHAR(255) NULL,
    -- 로그인 시도시 입력된 이메일/아이디

    success         BOOLEAN NOT NULL,
    failure_reason  VARCHAR(100) NULL,
    -- 'INVALID_PASSWORD', 'USER_NOT_FOUND', 'LOCKED' 등

    ip_address      VARCHAR(50) NULL,
    user_agent      TEXT NULL,

    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- 인덱스 정의
-- ===============================

-- users
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_email_verified ON users(email_verified);
CREATE INDEX idx_users_created_at ON users(created_at);

-- user_profiles
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_company_name ON user_profiles(company_name);

-- user_auth_providers
CREATE INDEX idx_auth_providers_user_id ON user_auth_providers(user_id);
CREATE UNIQUE INDEX idx_auth_providers_provider_user
    ON user_auth_providers(provider, provider_user_id);

-- user_roles
CREATE UNIQUE INDEX idx_user_roles_code ON user_roles(code);

-- user_role_mappings
CREATE INDEX idx_user_role_mappings_user_id ON user_role_mappings(user_id);
CREATE INDEX idx_user_role_mappings_role_id ON user_role_mappings(role_id);

-- user_status_logs
CREATE INDEX idx_status_logs_user_id ON user_status_logs(user_id);
CREATE INDEX idx_status_logs_user_created_at ON user_status_logs(user_id, created_at);

-- products
CREATE UNIQUE INDEX idx_products_code ON products(code);
CREATE INDEX idx_products_is_active ON products(is_active);

-- price_plans
CREATE INDEX idx_price_plans_product_id ON price_plans(product_id);
CREATE INDEX idx_price_plans_billing_type ON price_plans(billing_type);
CREATE INDEX idx_price_plans_is_active ON price_plans(is_active);

-- subscriptions
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_price_plan_id ON subscriptions(price_plan_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_user_status ON subscriptions(user_id, status);
CREATE INDEX idx_subscriptions_current_period_end ON subscriptions(current_period_end);

-- orders
CREATE UNIQUE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- order_items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_order_items_price_plan_id ON order_items(price_plan_id);

-- payments
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE UNIQUE INDEX idx_payments_provider_payment_id
    ON payments(provider, provider_payment_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);

-- refunds
CREATE INDEX idx_refunds_payment_id ON refunds(payment_id);
CREATE INDEX idx_refunds_status ON refunds(status);

-- user_activity_logs
CREATE INDEX idx_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON user_activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON user_activity_logs(created_at);
CREATE INDEX idx_activity_logs_user_created
    ON user_activity_logs(user_id, created_at);

-- admin_operation_logs
CREATE INDEX idx_admin_logs_admin_user_id ON admin_operation_logs(admin_user_id);
CREATE INDEX idx_admin_logs_target ON admin_operation_logs(target_type, target_id);
CREATE INDEX idx_admin_logs_created_at ON admin_operation_logs(created_at);

-- verifications
CREATE INDEX idx_verifications_user_id ON verifications(user_id);
CREATE INDEX idx_verifications_lookup
    ON verifications(channel, target_value, purpose, status);
CREATE INDEX idx_verifications_created_at ON verifications(created_at);

-- auth_login_attempts
CREATE INDEX idx_login_attempts_user_id ON auth_login_attempts(user_id);
CREATE INDEX idx_login_attempts_email ON auth_login_attempts(email);
CREATE INDEX idx_login_attempts_created_at ON auth_login_attempts(created_at);
CREATE INDEX idx_login_attempts_ip_created
    ON auth_login_attempts(ip_address, created_at);

# BulC Homepage Project Analysis and Improvement Guide

> Analysis Date: 2025-12-31
> Project: METEOR Fire Safety Simulation Platform Homepage

---

## 1. Project Overview

### 1.1 Tech Stack
| Area | Technology | Version |
|------|------------|---------|
| Frontend | React + TypeScript | 19.2.1 |
| Backend | Spring Boot + Java | 3.2.0 / 17 |
| Database | PostgreSQL | 16 |
| Infrastructure | Docker Compose | - |
| Payment | Toss Payments SDK | 1.9.2 |
| Auth | JWT + OAuth2 | - |

### 1.2 Project Structure
```
BulC_Homepage/
├── frontend/           # React SPA
├── backend/            # Spring Boot REST API
├── database/           # PostgreSQL init scripts
├── Document/           # Project documentation
└── docker-compose*.yml # Docker configuration
```

---

## 2. Feature Flow Analysis

### 2.1 User Authentication

#### 2.1.1 Signup Flow
```
[Frontend]                         [Backend]                        [Database]
    |                                  |                                 |
    |-- POST /api/auth/check-email --->|                                 |
    |<------- {exists: boolean} -------|                                 |
    |                                  |                                 |
    |-- POST /api/auth/send-verification>|                               |
    |  {email}                         |-- EmailService.send() --------->|
    |<--- {code: "verification"} ------|                                 |
    |                                  |                                 |
    |-- POST /api/auth/verify-code --->|                                 |
    |  {email, code}                   |-- Verify code ---------------->|
    |<--- {verified: true} ------------|                                 |
    |                                  |                                 |
    |-- POST /api/auth/signup -------->|                                 |
    |  {email, password, name}         |-- Create User ---------------->|
    |<--- {accessToken, refreshToken} -|                                 |
```

**Related Files:**
- `frontend/src/components/SignupModal.tsx`
- `backend/.../controller/AuthController.java`
- `backend/.../service/AuthService.java`
- `backend/.../service/EmailVerificationService.java`

#### 2.1.2 Login Flow
```
[Frontend]                         [Backend]                        [Database]
    |                                  |                                 |
    |-- POST /api/auth/login --------->|                                 |
    |  {email, password}               |-- Verify password ------------>|
    |                                  |-- Generate JWT token            |
    |<--- {accessToken, refreshToken,  |                                 |
    |      user: {id, email, name,     |                                 |
    |             rolesCode}} ---------|                                 |
    |                                  |                                 |
    |-- Save tokens to localStorage    |                                 |
    |-- Update AuthContext state       |                                 |
```

**JWT Token Refresh:**
- Auto-refresh 1 minute before Access Token expiry
- Call `POST /api/auth/refresh`
- Issue new Access Token with Refresh Token

**Related Files:**
- `frontend/src/context/AuthContext.tsx` - Token management, session timer
- `frontend/src/components/LoginModal.tsx`
- `backend/.../config/SecurityConfig.java`

#### 2.1.3 OAuth Social Login Flow
```
[Frontend]                   [OAuth Provider]              [Backend]
    |                              |                           |
    |-- Click OAuth login -------->|                           |
    |                              |-- Auth page redirect      |
    |<------ Auth complete --------|                           |
    |                              |                           |
    |-- /oauth/callback redirect --+-------------------------->|
    |  (with code parameter)       |                           |-- Exchange OAuth token
    |                              |                           |-- Get user info
    |                              |                           |
    |  [New User]                  |                           |
    |<- /oauth/setup-password -----+---------------------------|
    |   (Password setup page)      |                           |
    |                              |                           |
    |  [Existing User]             |                           |
    |<- JWT token issued ----------+---------------------------|
```

**Supported OAuth Providers:**
- Naver
- Kakao
- Google

**Related Files:**
- `frontend/src/pages/OAuthCallback.tsx`
- `frontend/src/pages/OAuthSetupPassword.tsx`
- `backend/.../config/SecurityConfig.java` (OAuth2 config)

---

### 2.2 Payment System

#### 2.2.1 Payment Request Flow
```
[Frontend]                    [Toss Payments]              [Backend]
    |                              |                           |
    |-- GET /api/products -------->|                           |
    |<- Product list --------------|                           |
    |                              |                           |
    |-- GET /api/products/{code}/plans                         |
    |<- Price plan list -----------|                           |
    |                              |                           |
    |-- Apply coupon (optional)    |                           |
    |  POST /api/promotions/validate                           |
    |<- Calculate discount --------|                           |
    |                              |                           |
    |-- loadTossPayments() ------->|                           |
    |-- requestPayment() --------->|                           |
    |  {amount, orderId,           |                           |
    |   orderName, customerInfo}   |-- Show payment modal      |
    |                              |                           |
    |<- Payment complete redirect -|                           |
    |   /payment/success           |                           |
    |   ?paymentKey=...            |                           |
    |   &orderId=...               |                           |
    |   &amount=...                |                           |
```

#### 2.2.2 Payment Confirmation Flow
```
[Frontend]                    [Backend]                   [Toss API]
    |                              |                           |
    |-- POST /api/payments/confirm>|                           |
    |  {paymentKey, orderId,       |                           |
    |   amount}                    |-- Toss payment confirm -->|
    |                              |<- Confirm result ---------|
    |                              |                           |
    |                              |-- Save Payment entity     |
    |                              |-- Create Subscription     |
    |                              |-- Issue License (optional)|
    |<- {success: true} -----------|                           |
```

**Order ID Format:**
- Pattern: `BULC_{pricePlanId}_{timestamp}_{random}`
- Example: `BULC_1_1735603200000_a1b2c3`

**Related Files:**
- `frontend/src/CategoryPages/Payment/Payment.tsx`
- `frontend/src/CategoryPages/Payment/PaymentSuccess.tsx`
- `backend/.../controller/PaymentController.java`
- `backend/.../service/PaymentService.java`

---

### 2.3 Licensing System

#### 2.3.1 License Validation Flow (Client App)
```
[Client App]                       [Backend]                  [Database]
    |                                  |                           |
    |-- POST /api/licenses/validate -->|                           |
    |  Authorization: Bearer {token}   |                           |
    |  {deviceFingerprint,             |-- Verify user             |
    |   productId, clientVersion}      |-- Query license --------->|
    |                                  |-- Validate policy         |
    |                                  |  - Check status (ACTIVE)  |
    |                                  |  - Check expiry date      |
    |                                  |  - Check concurrent sessions|
    |                                  |-- Create/Update Activation>|
    |                                  |                           |
    |<-- 200 OK -----------------------|                           |
    |    {valid: true,                 |                           |
    |     sessionToken, expiresAt,     |                           |
    |     offlineToken, entitlements}  |                           |
```

#### 2.3.2 Heartbeat Flow
```
[Client App]                       [Backend]                  [Database]
    |                                  |                           |
    |  (Periodic call: 5min interval)  |                           |
    |-- POST /api/licenses/heartbeat ->|                           |
    |  {deviceFingerprint, productId}  |-- Update Activation ----->|
    |<-- {valid: true, newExpiresAt} --|                           |
```

#### 2.3.3 License Status Flow
```
    PENDING -------> ACTIVE -------> EXPIRED_GRACE -------> EXPIRED_HARD
                       |
                       v
                   SUSPENDED (recoverable)
                       |
                       v
                   REVOKED (not recoverable)
```

**Related Files:**
- `backend/.../licensing/controller/LicenseController.java`
- `backend/.../licensing/service/LicenseService.java`
- `backend/.../licensing/domain/*.java`
- `Document/licensing_api_v1.1.md`

---

### 2.4 MyPage

#### 2.4.1 User Information Management Flow
```
[Frontend]                         [Backend]                  [Database]
    |                                  |                           |
    |-- GET /api/users/me ------------>|                           |
    |  Authorization: Bearer {token}   |-- Query User ------------>|
    |<-- {email, name, phone, country}-|                           |
    |                                  |                           |
    |-- PUT /api/users/me ------------>|                           |
    |  {name, phone, country}          |-- Update User ----------->|
    |<-- Updated User -----------------|                           |
    |                                  |                           |
    |-- PUT /api/users/me/password --->|                           |
    |  {currentPassword, newPassword}  |-- Verify & change pwd --->|
    |<-- {success: true} --------------|                           |
```

**Features:**
- Profile info view/edit (name, phone)
- Password change
- Country/language settings
- Logout

**Related Files:**
- `frontend/src/CategoryPages/MyPage/MyPage.tsx`
- `backend/.../controller/UserController.java`

---

### 2.5 Admin Page

#### 2.5.1 License Plan Management
```
[Admin UI]                         [Backend]                  [Database]
    |                                  |                           |
    |-- GET /api/admin/license-plans ->|                           |
    |<-- Plan list --------------------|                           |
    |                                  |                           |
    |-- POST /api/admin/license-plans >|                           |
    |  {code, name, licenseType,       |-- Create LicensePlan ---->|
    |   durationDays, maxActivations}  |                           |
    |<-- Created plan -----------------|                           |
    |                                  |                           |
    |-- PUT /api/admin/license-plans/{id}                          |
    |-- DELETE /api/admin/license-plans/{id} (soft delete)         |
```

**Related Files:**
- `frontend/src/CategoryPages/Admin/AdminPage.tsx`
- `backend/.../licensing/controller/LicensePlanAdminController.java`
- `backend/.../licensing/service/LicensePlanAdminService.java`

---

## 3. Database ERD Summary

### 3.1 Core Table Relationships
```
users (PK: email)
    |
    |--< user_social_accounts (OAuth connection)
    |--< subscriptions (subscription)
    |       |
    |       +--< payments (payment)
    |               |
    |               +-- payment_details (PG details)
    |
    +--< licenses (license, linked by owner_id)
            |
            +--< license_activations (device activation)

products (PK: code)
    |
    |--< price_plans (price plan)
    +--< licenses (product-based license)

license_plans (PK: id, UUID)
    |
    |--< license_plan_entitlements (feature permissions)
    +--< licenses (plan-based issuance)
```

---

## 4. Improvement Recommendations

### 4.1 Security Enhancements

#### 4.1.1 Remove Verification Code Exposure (HIGH)
**Current State:**
```java
// AuthController.java:116
return ResponseEntity.ok(ApiResponse.success(
    "Verification code sent",
    Map.of("code", code) // TODO: Remove in production
));
```

**Recommendation:**
- Add environment-based branching
- Remove verification code from response in production

```java
@Value("${spring.profiles.active:dev}")
private String activeProfile;

// Don't return code in production
if ("prod".equals(activeProfile)) {
    return ResponseEntity.ok(ApiResponse.success("Verification code sent", Map.of()));
}
```

#### 4.1.2 Remove Hash Generation Endpoint (HIGH)
**Current State:**
```java
// AuthController.java:145-150
@GetMapping("/hash")
public ResponseEntity<ApiResponse<Map<String, String>>> generateHash(@RequestParam String password) {
    // Security vulnerability: password hash exposure
}
```

**Recommendation:**
- Remove this endpoint completely
- Use separate CLI tool for development needs

#### 4.1.3 Enforce HTTPS (HIGH)
**Current State:**
- Frontend calls HTTP API
- `http://${window.location.hostname}:8080`

**Recommendation:**
```typescript
// AuthContext.tsx
const getApiBaseUrl = () => {
  const protocol = window.location.protocol; // https: or http:
  return `${protocol}//${window.location.hostname}:8080`;
};
```

```nginx
# nginx.conf - Add HTTPS redirect
server {
    listen 80;
    return 301 https://$host$request_uri;
}
```

---

### 4.2 Performance Optimization

#### 4.2.1 API Response Caching (MEDIUM)
**Current State:**
- Product/plan lists queried every time

**Recommendation:**
```java
@Cacheable(value = "products", key = "'all'", unless = "#result.isEmpty()")
public List<Product> getActiveProducts() { ... }

@Cacheable(value = "pricePlans", key = "#productCode + '-' + #currency")
public List<PricePlan> getPlans(String productCode, String currency) { ... }
```

#### 4.2.2 Token Refresh Optimization (MEDIUM)
**Current State:**
- Session check every 1 second (`setInterval(checkSession, 1000)`)

**Recommendation:**
```typescript
// Set precise timer based on expiry time
useEffect(() => {
  const expiration = localStorage.getItem('tokenExpiration');
  if (!expiration) return;

  const timeUntilRefresh = parseInt(expiration) - Date.now() - 60000; // 1 min before
  const timer = setTimeout(refreshAccessToken, Math.max(0, timeUntilRefresh));

  return () => clearTimeout(timer);
}, [user]);
```

#### 4.2.3 Frontend Bundle Optimization (MEDIUM)
**Current State:**
- Single bundle loads all pages

**Recommendation:**
- Code splitting with React.lazy + Suspense

```typescript
const PaymentPage = React.lazy(() => import('./CategoryPages/Payment/Payment'));
const AdminPage = React.lazy(() => import('./CategoryPages/Admin/AdminPage'));

<Suspense fallback={<Loading />}>
  <Route path="/payment" element={<PaymentPage />} />
  <Route path="/admin" element={<AdminPage />} />
</Suspense>
```

---

### 4.3 UX Improvements

#### 4.3.1 Unified Loading State (LOW)
**Current State:**
- Different loading UI per page

**Recommendation:**
- Implement common loading component
- Introduce Skeleton UI

```typescript
// components/Skeleton.tsx
export const CardSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton-line title" />
    <div className="skeleton-line" />
    <div className="skeleton-line short" />
  </div>
);
```

#### 4.3.2 Unified Error Handling (MEDIUM)
**Current State:**
- Uses `alert()`

**Recommendation:**
- Introduce Toast notification system

```typescript
// hooks/useToast.ts
export const useToast = () => {
  const show = (message: string, type: 'success' | 'error' | 'info') => {
    // Toast display logic
  };
  return { show };
};
```

#### 4.3.3 Enhanced Form Validation (MEDIUM)
**Current State:**
- Only basic client-side validation

**Recommendation:**
- Introduce React Hook Form + Zod

```typescript
const signupSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Za-z]/, 'Include letters')
    .regex(/[0-9]/, 'Include numbers')
    .regex(/[!@#$%^&*]/, 'Include special characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});
```

---

### 4.4 Code Quality Improvements

#### 4.4.1 Centralized API Base URL (MEDIUM)
**Current State:**
- `getApiUrl()` duplicated in each file

**Recommendation:**
```typescript
// config/api.ts
export const API_BASE_URL = (() => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  return window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : `${window.location.protocol}//${window.location.hostname}:8080`;
})();

// API client
export const api = {
  get: <T>(path: string) => fetch(`${API_BASE_URL}${path}`).then(r => r.json() as T),
  post: <T>(path: string, body: any) => fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json() as T),
};
```

#### 4.4.2 Separate Type Definitions (LOW)
**Current State:**
- Interfaces defined inside components

**Recommendation:**
```typescript
// types/user.ts
export interface User {
  id: string;
  email: string;
  name?: string;
  rolesCode?: string;
}

// types/payment.ts
export interface Product { ... }
export interface PricePlan { ... }
export interface PaymentInfo { ... }
```

#### 4.4.3 Unified Error Response Type (MEDIUM)
**Current State:**
- `ApiResponse<T>` used but some inconsistencies

**Recommendation:**
```java
// Unify all API responses to ApiResponse
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
        return ResponseEntity.status(500)
            .body(ApiResponse.error(e.getMessage()));
    }
}
```

---

### 4.5 Feature Extension Suggestions

#### 4.5.1 Password Reset Feature (HIGH)
**Current State:**
- Not implemented

**Implementation Plan:**
1. Send reset link via email
2. Token-based temporary authentication
3. Set new password

```
POST /api/auth/forgot-password  {email}
POST /api/auth/reset-password   {token, newPassword}
```

#### 4.5.2 Payment History View (MEDIUM)
**Current State:**
- Payment history not shown in MyPage

**Implementation Plan:**
```
GET /api/users/me/payments
GET /api/users/me/subscriptions
```

#### 4.5.3 Admin Dashboard Extension (LOW)
**Current State:**
- Only license plan management exists

**Extension Suggestions:**
- User list/management
- Payment status charts
- License issuance status
- Activity log view

---

## 5. Priority Summary

### Urgent (Security)
1. Remove verification code from response (production)
2. Remove `/api/auth/hash` endpoint
3. Enforce HTTPS

### High (Core Features)
4. Implement password reset feature
5. Centralized API Base URL
6. Unified error handling (Toast)

### Medium (Usability/Performance)
7. Payment history view feature
8. API response caching
9. Enhanced form validation
10. Token refresh optimization

### Low (Code Quality)
11. Code splitting
12. Separate type definitions
13. Common loading component
14. Admin dashboard extension

---

## 6. Reference Documents

- `Document/licensing_api_v1.1.md` - Licensing API detailed spec
- `Document/licensing_domain_v1.md` - Licensing domain design
- `Document/bulc_auth_module_spec_v0.2.md` - Auth module spec
- `CLAUDE.md` - Development guide

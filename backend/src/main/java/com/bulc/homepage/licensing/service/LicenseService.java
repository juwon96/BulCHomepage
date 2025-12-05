package com.bulc.homepage.licensing.service;

import com.bulc.homepage.licensing.domain.*;
import com.bulc.homepage.licensing.dto.*;
import com.bulc.homepage.licensing.exception.LicenseException;
import com.bulc.homepage.licensing.exception.LicenseException.ErrorCode;
import com.bulc.homepage.licensing.repository.ActivationRepository;
import com.bulc.homepage.licensing.repository.LicensePlanRepository;
import com.bulc.homepage.licensing.repository.LicenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

/**
 * 라이선스 서비스.
 *
 * 이 서비스는 두 가지 용도로 사용됩니다:
 *
 * 1. 내부 모듈용 (Billing, Admin 등에서 직접 호출)
 *    - issueLicense(): 결제 완료 시 Billing에서 호출
 *    - revokeLicense(), revokeLicenseByOrderId(): 환불 시 Billing에서 호출
 *    - suspendLicense(): 관리자가 Admin 모듈에서 호출
 *    - renewLicense(): 구독 갱신 시 Billing에서 호출
 *
 * 2. 클라이언트 API용 (Controller에서 호출)
 *    - validateAndActivate(): 클라이언트 앱의 라이선스 검증/활성화
 *    - getLicense(), getLicenseByKey(): 라이선스 정보 조회
 *    - getLicensesByOwner(): 사용자의 라이선스 목록 조회
 *    - deactivate(): 사용자가 직접 기기 해제
 *
 * 주의: 발급/정지/회수/갱신은 HTTP API로 노출하지 않습니다.
 * 이러한 작업은 반드시 Billing 또는 Admin 모듈을 통해 트리거되어야 합니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LicenseService {

    private final LicenseRepository licenseRepository;
    private final ActivationRepository activationRepository;
    private final LicensePlanRepository planRepository;

    // ==========================================
    // 내부 모듈용 메서드 (Billing, Admin에서 호출)
    // HTTP API로 노출하지 않음
    // ==========================================

    /**
     * 라이선스 발급.
     *
     * Billing 모듈에서 결제 완료(OrderPaid) 시 호출합니다.
     * HTTP API로 노출하지 않습니다.
     *
     * 사용 예시 (BillingService):
     * <pre>
     * {@code
     * @Transactional
     * public void completePayment(PaymentResult result) {
     *     Order order = orderRepository.findById(result.orderId());
     *     order.markPaid(result.paidAt());
     *
     *     licensingService.issueLicense(new LicenseIssueRequest(
     *         OwnerType.USER,
     *         order.getUserId(),
     *         order.getProductId(),
     *         order.getPlanId(),
     *         LicenseType.SUBSCRIPTION,
     *         null, null,
     *         order.getValidUntil(),
     *         policySnapshot,
     *         order.getId()
     *     ));
     * }
     * }
     * </pre>
     */
    @Transactional
    public LicenseResponse issueLicense(LicenseIssueRequest request) {
        // 동일 제품에 대한 기존 라이선스 확인
        licenseRepository.findByOwnerTypeAndOwnerIdAndProductId(
                request.ownerType(), request.ownerId(), request.productId()
        ).ifPresent(existing -> {
            if (existing.getStatus() != LicenseStatus.REVOKED) {
                throw new LicenseException(ErrorCode.LICENSE_ALREADY_EXISTS);
            }
        });

        // 라이선스 키 생성
        String licenseKey = generateLicenseKey();

        License license = License.builder()
                .ownerType(request.ownerType())
                .ownerId(request.ownerId())
                .productId(request.productId())
                .planId(request.planId())
                .licenseType(request.licenseType())
                .usageCategory(request.usageCategoryOrDefault())
                .validFrom(request.validFrom())
                .validUntil(request.validUntil())
                .policySnapshot(request.policySnapshot() != null ? request.policySnapshot() : defaultPolicySnapshot())
                .licenseKey(licenseKey)
                .sourceOrderId(request.sourceOrderId())
                .build();

        // 발급 즉시 활성화 (결제 완료된 경우)
        license.activate();

        License saved = licenseRepository.save(license);
        return LicenseResponse.from(saved);
    }

    /**
     * Plan 기반 라이선스 발급.
     *
     * Billing 모듈에서 결제 완료(OrderPaid) 시 planId와 함께 호출합니다.
     * Plan에서 PolicySnapshot을 자동으로 생성하여 License에 저장합니다.
     *
     * 사용 예시 (BillingService):
     * <pre>
     * {@code
     * @Transactional
     * public void completePayment(PaymentResult result) {
     *     Order order = orderRepository.findById(result.orderId());
     *     order.markPaid(result.paidAt());
     *
     *     licensingService.issueLicenseWithPlan(
     *         OwnerType.USER,
     *         order.getUserId(),
     *         order.getPlanId(),
     *         order.getId(),
     *         UsageCategory.COMMERCIAL
     *     );
     * }
     * }
     * </pre>
     */
    @Transactional
    public LicenseResponse issueLicenseWithPlan(OwnerType ownerType, UUID ownerId,
                                                UUID planId, UUID sourceOrderId,
                                                UsageCategory usageCategory) {
        // Plan 조회 (활성화되고 삭제되지 않은 플랜만)
        LicensePlan plan = planRepository.findAvailableById(planId)
                .orElseThrow(() -> new LicenseException(ErrorCode.PLAN_NOT_AVAILABLE));

        // 동일 제품에 대한 기존 라이선스 확인
        licenseRepository.findByOwnerTypeAndOwnerIdAndProductId(
                ownerType, ownerId, plan.getProductId()
        ).ifPresent(existing -> {
            if (existing.getStatus() != LicenseStatus.REVOKED) {
                throw new LicenseException(ErrorCode.LICENSE_ALREADY_EXISTS);
            }
        });

        // 라이선스 키 생성
        String licenseKey = generateLicenseKey();

        // Plan에서 PolicySnapshot 생성
        Map<String, Object> policySnapshot = plan.toPolicySnapshot();

        // 유효기간 계산
        Instant now = Instant.now();
        Instant validUntil = plan.getLicenseType() == LicenseType.PERPETUAL
                ? null
                : now.plusSeconds((long) plan.getDurationDays() * 24 * 60 * 60);

        License license = License.builder()
                .ownerType(ownerType)
                .ownerId(ownerId)
                .productId(plan.getProductId())
                .planId(planId)
                .licenseType(plan.getLicenseType())
                .usageCategory(usageCategory != null ? usageCategory : UsageCategory.COMMERCIAL)
                .validFrom(now)
                .validUntil(validUntil)
                .policySnapshot(policySnapshot)
                .licenseKey(licenseKey)
                .sourceOrderId(sourceOrderId)
                .build();

        // 발급 즉시 활성화 (결제 완료된 경우)
        license.activate();

        License saved = licenseRepository.save(license);
        return LicenseResponse.from(saved);
    }

    /**
     * Plan 코드 기반 라이선스 발급.
     * planId 대신 planCode로 조회하여 발급합니다.
     */
    @Transactional
    public LicenseResponse issueLicenseWithPlanCode(OwnerType ownerType, UUID ownerId,
                                                    String planCode, UUID sourceOrderId,
                                                    UsageCategory usageCategory) {
        // Plan 조회 (코드로)
        LicensePlan plan = planRepository.findAvailableByCode(planCode)
                .orElseThrow(() -> new LicenseException(ErrorCode.PLAN_NOT_AVAILABLE));

        return issueLicenseWithPlan(ownerType, ownerId, plan.getId(), sourceOrderId, usageCategory);
    }

    // ==========================================
    // 클라이언트 API용 메서드 (Controller에서 호출)
    // ==========================================

    /**
     * 라이선스 조회 (ID).
     * 클라이언트/마이페이지에서 라이선스 상세 정보 조회 시 사용.
     */
    public LicenseResponse getLicense(UUID licenseId) {
        License license = findLicenseOrThrow(licenseId);
        return LicenseResponse.from(license);
    }

    /**
     * 라이선스 조회 (라이선스 키).
     * 클라이언트가 라이선스 키로 정보 조회 시 사용.
     */
    public LicenseResponse getLicenseByKey(String licenseKey) {
        License license = licenseRepository.findByLicenseKey(licenseKey)
                .orElseThrow(() -> new LicenseException(ErrorCode.LICENSE_NOT_FOUND));
        return LicenseResponse.from(license);
    }

    /**
     * 사용자의 라이선스 목록 조회.
     * 마이페이지에서 사용자의 라이선스 목록 조회 시 사용.
     * TODO: 인증된 사용자만 자신의 라이선스를 조회할 수 있도록 권한 체크 필요
     */
    public List<LicenseResponse> getLicensesByOwner(OwnerType ownerType, UUID ownerId) {
        return licenseRepository.findByOwnerTypeAndOwnerId(ownerType, ownerId)
                .stream()
                .map(LicenseResponse::from)
                .toList();
    }

    /**
     * 라이선스 검증 및 활성화.
     * 클라이언트 앱 실행 시 호출하여 라이선스 유효성 확인 및 기기 활성화.
     * 동시성 제어를 위해 비관적 락 사용.
     */
    @Transactional
    public ValidationResponse validateAndActivate(String licenseKey, ActivationRequest request) {
        // 비관적 락으로 라이선스 조회 (race condition 방지)
        License license = licenseRepository.findByLicenseKeyWithLock(licenseKey)
                .orElseThrow(() -> new LicenseException(ErrorCode.LICENSE_NOT_FOUND));

        Instant now = Instant.now();
        LicenseStatus effectiveStatus = license.calculateEffectiveStatus(now);

        // 상태 검증
        switch (effectiveStatus) {
            case EXPIRED_HARD -> {
                return ValidationResponse.failure(
                        ErrorCode.LICENSE_EXPIRED.name(),
                        ErrorCode.LICENSE_EXPIRED.getMessage()
                );
            }
            case SUSPENDED -> {
                return ValidationResponse.failure(
                        ErrorCode.LICENSE_SUSPENDED.name(),
                        ErrorCode.LICENSE_SUSPENDED.getMessage()
                );
            }
            case REVOKED -> {
                return ValidationResponse.failure(
                        ErrorCode.LICENSE_REVOKED.name(),
                        ErrorCode.LICENSE_REVOKED.getMessage()
                );
            }
            case PENDING -> {
                return ValidationResponse.failure(
                        ErrorCode.INVALID_LICENSE_STATE.name(),
                        "라이선스가 아직 활성화되지 않았습니다"
                );
            }
            // ACTIVE, EXPIRED_GRACE는 계속 진행
        }

        // 활성화 가능 여부 확인
        if (!license.canActivate(request.deviceFingerprint(), now)) {
            // 동시 세션 수 확인
            long activeCount = activationRepository.countByLicenseIdAndStatus(
                    license.getId(), ActivationStatus.ACTIVE
            );
            if (activeCount >= license.getMaxConcurrentSessions()) {
                return ValidationResponse.failure(
                        ErrorCode.CONCURRENT_SESSION_LIMIT_EXCEEDED.name(),
                        ErrorCode.CONCURRENT_SESSION_LIMIT_EXCEEDED.getMessage()
                );
            }
            return ValidationResponse.failure(
                    ErrorCode.ACTIVATION_LIMIT_EXCEEDED.name(),
                    ErrorCode.ACTIVATION_LIMIT_EXCEEDED.getMessage()
            );
        }

        // 활성화 추가/갱신
        Activation activation = license.addActivation(
                request.deviceFingerprint(),
                request.clientVersion(),
                request.clientOs(),
                request.clientIp()
        );

        // 오프라인 토큰 발급 (필요시)
        if (!activation.hasValidOfflineToken(now)) {
            int offlineDays = getOfflineTokenValidDays(license);
            String offlineToken = generateOfflineToken(license, activation);
            activation.issueOfflineToken(offlineToken, now.plusSeconds(offlineDays * 24L * 60 * 60));
        }

        licenseRepository.save(license);

        // Entitlements 추출
        List<String> entitlements = extractEntitlements(license);

        return ValidationResponse.success(
                license.getId(),
                effectiveStatus,
                license.getValidUntil(),
                entitlements,
                activation.getOfflineToken(),
                activation.getOfflineTokenExpiresAt()
        );
    }

    /**
     * 기기 비활성화.
     * 사용자가 특정 기기에서 라이선스를 해제할 때 사용.
     */
    @Transactional
    public void deactivate(UUID licenseId, String deviceFingerprint) {
        License license = findLicenseOrThrow(licenseId);

        Activation activation = activationRepository
                .findByLicenseIdAndDeviceFingerprint(licenseId, deviceFingerprint)
                .orElseThrow(() -> new LicenseException(ErrorCode.ACTIVATION_NOT_FOUND));

        activation.deactivate();
        activationRepository.save(activation);
    }

    // ==========================================
    // 내부 모듈용 메서드 (Billing, Admin에서 호출)
    // HTTP API로 노출하지 않음
    // ==========================================

    /**
     * 라이선스 정지.
     *
     * Admin 모듈에서 관리자가 라이선스를 정지할 때 호출합니다.
     * HTTP API로 노출하지 않습니다.
     */
    @Transactional
    public LicenseResponse suspendLicense(UUID licenseId, String reason) {
        License license = findLicenseOrThrow(licenseId);
        license.suspend(reason);
        return LicenseResponse.from(licenseRepository.save(license));
    }

    /**
     * 라이선스 회수 (ID로 조회).
     *
     * Admin 모듈에서 관리자가 라이선스를 회수할 때 호출합니다.
     * HTTP API로 노출하지 않습니다.
     */
    @Transactional
    public LicenseResponse revokeLicense(UUID licenseId, String reason) {
        License license = findLicenseOrThrow(licenseId);
        license.revoke(reason);
        return LicenseResponse.from(licenseRepository.save(license));
    }

    /**
     * 주문 ID로 라이선스 회수.
     *
     * Billing 모듈에서 환불(OrderRefunded) 시 호출합니다.
     * HTTP API로 노출하지 않습니다.
     *
     * 사용 예시 (BillingService):
     * <pre>
     * {@code
     * @Transactional
     * public void processRefund(RefundResult result) {
     *     Order order = orderRepository.findById(result.orderId());
     *     order.markRefunded();
     *
     *     licensingService.revokeLicenseByOrderId(order.getId(), "REFUNDED");
     * }
     * }
     * </pre>
     */
    @Transactional
    public LicenseResponse revokeLicenseByOrderId(UUID orderId, String reason) {
        License license = licenseRepository.findBySourceOrderId(orderId)
                .orElseThrow(() -> new LicenseException(ErrorCode.LICENSE_NOT_FOUND));
        license.revoke(reason);
        return LicenseResponse.from(licenseRepository.save(license));
    }

    /**
     * 구독 갱신.
     *
     * Billing 모듈에서 구독 갱신 결제 완료 시 호출합니다.
     * HTTP API로 노출하지 않습니다.
     */
    @Transactional
    public LicenseResponse renewLicense(UUID licenseId, Instant newValidUntil) {
        License license = findLicenseOrThrow(licenseId);
        license.renew(newValidUntil);
        return LicenseResponse.from(licenseRepository.save(license));
    }

    // === Private 헬퍼 메서드 ===

    private License findLicenseOrThrow(UUID licenseId) {
        return licenseRepository.findById(licenseId)
                .orElseThrow(() -> new LicenseException(ErrorCode.LICENSE_NOT_FOUND));
    }

    private String generateLicenseKey() {
        // 형식: XXXX-XXXX-XXXX-XXXX
        String uuid = UUID.randomUUID().toString().replace("-", "").toUpperCase();
        return String.format("%s-%s-%s-%s",
                uuid.substring(0, 4),
                uuid.substring(4, 8),
                uuid.substring(8, 12),
                uuid.substring(12, 16)
        );
    }

    private Map<String, Object> defaultPolicySnapshot() {
        return Map.of(
                "maxActivations", 3,
                "maxConcurrentSessions", 2,
                "gracePeriodDays", 7,
                "allowOfflineDays", 30,
                "entitlements", List.of("core-simulation")
        );
    }

    private int getOfflineTokenValidDays(License license) {
        if (license.getPolicySnapshot() != null &&
                license.getPolicySnapshot().containsKey("allowOfflineDays")) {
            return ((Number) license.getPolicySnapshot().get("allowOfflineDays")).intValue();
        }
        return 30; // 기본값
    }

    @SuppressWarnings("unchecked")
    private List<String> extractEntitlements(License license) {
        if (license.getPolicySnapshot() != null &&
                license.getPolicySnapshot().containsKey("entitlements")) {
            Object entitlements = license.getPolicySnapshot().get("entitlements");
            if (entitlements instanceof List<?>) {
                return (List<String>) entitlements;
            }
        }
        return List.of("core-simulation");
    }

    private String generateOfflineToken(License license, Activation activation) {
        // TODO: 실제 구현에서는 JWT 또는 서명된 토큰 생성
        // 현재는 간단한 Base64 인코딩으로 대체
        String payload = String.format("%s:%s:%s:%d",
                license.getId(),
                activation.getDeviceFingerprint(),
                license.getLicenseKey(),
                Instant.now().toEpochMilli()
        );
        return Base64.getEncoder().encodeToString(payload.getBytes());
    }
}

package com.bulc.homepage.controller;

import com.bulc.homepage.entity.User;
import com.bulc.homepage.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    /**
     * 현재 로그인한 사용자 정보 조회
     */
    @GetMapping("/me")
    public ResponseEntity<UserInfoResponse> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(401).build();
        }

        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).build();
        }

        return ResponseEntity.ok(new UserInfoResponse(
                user.getEmail(),
                user.getName(),
                user.getPhone()
        ));
    }

    /**
     * 사용자 정보 업데이트 (이름, 전화번호)
     */
    @PutMapping("/me")
    public ResponseEntity<UserInfoResponse> updateCurrentUser(@RequestBody UpdateUserRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(401).build();
        }

        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).build();
        }

        // 이름이 비어있지 않으면 업데이트
        if (request.name() != null && !request.name().isBlank()) {
            user.setName(request.name());
        }

        // 전화번호가 비어있지 않으면 업데이트
        if (request.phone() != null && !request.phone().isBlank()) {
            user.setPhone(request.phone());
        }

        userRepository.save(user);

        return ResponseEntity.ok(new UserInfoResponse(
                user.getEmail(),
                user.getName(),
                user.getPhone()
        ));
    }

    // DTOs
    public record UserInfoResponse(String email, String name, String phone) {}
    public record UpdateUserRequest(String name, String phone) {}
}

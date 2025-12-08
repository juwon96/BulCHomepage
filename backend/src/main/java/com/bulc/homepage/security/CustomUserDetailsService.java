package com.bulc.homepage.security;

import com.bulc.homepage.entity.User;
import com.bulc.homepage.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();

        // rolesCode 기반 권한 설정
        String rolesCode = user.getRolesCode();
        if (rolesCode != null) {
            switch (rolesCode) {
                case "000":
                    authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                    break;
                case "001":
                    authorities.add(new SimpleGrantedAuthority("ROLE_MANAGER"));
                    break;
                default:
                    authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                    break;
            }
        } else {
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash() != null ? user.getPasswordHash() : "",
                authorities
        );
    }
}

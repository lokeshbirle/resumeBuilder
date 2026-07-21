package com.app.resumebuilder.service;

import com.app.resumebuilder.dto.AuthRequestDto;
import com.app.resumebuilder.dto.AuthResponseDto;
import com.app.resumebuilder.model.User;
import com.app.resumebuilder.repository.UserRepository;
import com.app.resumebuilder.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponseDto register(AuthRequestDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponseDto(token, user.getName(), user.getEmail());
    }

    public AuthResponseDto login(AuthRequestDto request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponseDto(token, user.getName(), user.getEmail());
    }
}
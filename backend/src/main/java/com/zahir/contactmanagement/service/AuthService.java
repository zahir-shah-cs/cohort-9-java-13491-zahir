package com.zahir.contactmanagement.service;

import com.zahir.contactmanagement.DTOs.LoginRequest;
import com.zahir.contactmanagement.DTOs.RegisterRequest;
import com.zahir.contactmanagement.entity.User;
import com.zahir.contactmanagement.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private static final Logger logger =
            LoggerFactory.getLogger(AuthService.class);
    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterRequest request) {
        logger.info(
                "New user registration attempt. email={}",
                request.getEmail()
        );

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number already registered");
        }

        User user = new User();

        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        // Never save plain-text password
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );
        User savedUser = userRepository.save(user);
        logger.info(
                "User registered successfully. userId={}",
                savedUser.getId()
        );
        return savedUser;
    }

    public User login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password")
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {

            logger.warn(
                    "Login failed. Invalid credentials. email={}",
                    request.getEmail()
            );

            throw new RuntimeException("Invalid email or password");
        }

        logger.info(
                "User login successful. userId={}",
                user.getId()
        );
        return user;
    }
}
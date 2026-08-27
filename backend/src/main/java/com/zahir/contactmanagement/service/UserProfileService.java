package com.zahir.contactmanagement.service;

import com.zahir.contactmanagement.DTOs.ChangePasswordRequest;
import com.zahir.contactmanagement.DTOs.UserProfileResponse;
import com.zahir.contactmanagement.entity.User;
import com.zahir.contactmanagement.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // GET PROFILE
    public UserProfileResponse getProfile(User user) {

        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getPhone()
        );
    }


    // UPDATE PROFILE
    public UserProfileResponse updateProfile(
            User user,
            String email,
            String phone
    ) {

        user.setEmail(email);
        user.setPhone(phone);

        User updatedUser = userRepository.save(user);

        return new UserProfileResponse(
                updatedUser.getId(),
                updatedUser.getEmail(),
                updatedUser.getPhone()
        );
    }


    // CHANGE PASSWORD
    public void changePassword(
            User user,
            ChangePasswordRequest request
    ) {

        // Check current password
        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword()
        )) {

            throw new RuntimeException(
                    "Current password is incorrect"
            );
        }

        // Encode new password
        String encodedPassword =
                passwordEncoder.encode(
                        request.getNewPassword()
                );

        user.setPassword(encodedPassword);

        userRepository.save(user);
    }
}
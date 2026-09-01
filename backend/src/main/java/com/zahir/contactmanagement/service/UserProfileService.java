package com.zahir.contactmanagement.service;

import com.zahir.contactmanagement.exception.BadRequestException;
import com.zahir.contactmanagement.DTOs.ChangePasswordRequest;
import com.zahir.contactmanagement.DTOs.UserProfileResponse;
import com.zahir.contactmanagement.entity.User;
import com.zahir.contactmanagement.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private static final Logger logger =
            LoggerFactory.getLogger(UserProfileService.class);

    public UserProfileService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // GET PROFILE
    public UserProfileResponse getProfile(User user) {
        logger.info(
                "Fetching user profile. userId={}",
                user.getId()
        );
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
        logger.info(
                "Updating user profile. userId={}",
                user.getId()
        );

        user.setEmail(email);
        user.setPhone(phone);

        User updatedUser = userRepository.save(user);
        logger.info(
                "User profile updated successfully. userId={}",
                user.getId()
        );

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

        logger.info(
                "Password change requested. userId={}",
                user.getId()
        );

        // Check current password
        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword()
        )) {
            logger.warn(
                    "Password change failed. Current password incorrect. userId={}",
                    user.getId()
            );
            throw new BadRequestException(
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
        logger.info(
                "Password changed successfully. userId={}",
                user.getId()
        );
    }
}
package com.zahir.contactmanagement.controller;

import com.zahir.contactmanagement.DTOs.ChangePasswordRequest;
import com.zahir.contactmanagement.DTOs.UserProfileResponse;
import com.zahir.contactmanagement.DTOs.UserProfileRequest;
import com.zahir.contactmanagement.entity.User;
import com.zahir.contactmanagement.service.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(
            UserProfileService userProfileService
    ) {
        this.userProfileService = userProfileService;
    }


    // GET PROFILE
    @GetMapping
    public ResponseEntity<UserProfileResponse> getProfile(
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        UserProfileResponse profile =
                userProfileService.getProfile(user);

        return ResponseEntity.ok(profile);
    }


    // UPDATE PROFILE
    @PutMapping
    public ResponseEntity<UserProfileResponse> updateProfile(
            @RequestBody UserProfileRequest request,
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        UserProfileResponse updatedProfile =
                userProfileService.updateProfile(
                        user,
                        request.getEmail(),
                        request.getPhone()
                );

        return ResponseEntity.ok(updatedProfile);
    }


    // CHANGE PASSWORD
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestBody ChangePasswordRequest request,
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        userProfileService.changePassword(
                user,
                request
        );

        return ResponseEntity.ok(
                "Password changed successfully"
        );
    }
}
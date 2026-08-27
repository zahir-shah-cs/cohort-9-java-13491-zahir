package com.zahir.contactmanagement.DTOs;

public class UserProfileResponse {

    private Long id;
    private String email;
    private String phone;

    public UserProfileResponse() {
    }

    public UserProfileResponse(Long id, String email, String phone) {
        this.id = id;
        this.email = email;
        this.phone = phone;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }
}
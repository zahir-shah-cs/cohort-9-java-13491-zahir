package com.zahir.contactmanagement.DTOs;

public class UserProfileRequest {

    private String email;
    private String phone;

    public UserProfileRequest() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
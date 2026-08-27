package com.zahir.contactmanagement.DTOs;

public class AuthResponse {

    private String token;
    private Long id;
    private String email;
    private String phone;

    public AuthResponse(
            String token,
            Long id,
            String email,
            String phone
    ) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.phone = phone;
    }

    public String getToken() {
        return token;
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
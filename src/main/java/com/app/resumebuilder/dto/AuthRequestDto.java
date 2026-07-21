package com.app.resumebuilder.dto;

import lombok.Data;

@Data
public class AuthRequestDto {
    private String name;   // only needed for register
    private String email;
    private String password;
}
package com.app.resumebuilder.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonalInfo {
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String linkedin;
    private String github;
    private String portfolio;
    private String summary;
}
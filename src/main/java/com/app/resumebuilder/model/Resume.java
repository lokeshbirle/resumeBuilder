package com.app.resumebuilder.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "resumes")
public class Resume {

    @Id
    private String id;
    private String userId;
    private String title;
    private PersonalInfo personalInfo;
    private List<Education> education;
    private List<Experience> experience;
    private List<Project> projects;
    private List<String> skills;
    private List<String> certifications;
    private List<String> achievements;
    private List<CustomSection> customSections;
    private List<String> sectionOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
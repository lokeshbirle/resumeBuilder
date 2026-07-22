package com.app.resumebuilder.dto;

import com.app.resumebuilder.model.CustomSection;
import com.app.resumebuilder.model.Education;
import com.app.resumebuilder.model.Experience;
import com.app.resumebuilder.model.PersonalInfo;
import com.app.resumebuilder.model.Project;
import lombok.Data;

import java.util.List;

@Data
public class ResumeRequestDto {
    private String title;
    private PersonalInfo personalInfo;
    private List<Education> education;
    private List<Experience> experience;
    private List<Project> projects;
    private List<String> skills;
    private List<String> certifications;
    private List<String> achievements;
    private List<CustomSection> customSections; // THIS FOR DYNAMIC SECTIONS
    private List<String> sectionOrder;
}
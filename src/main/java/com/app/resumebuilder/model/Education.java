package com.app.resumebuilder.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Education {
    private String institution;
    private String degree;
    private String fieldOfStudy;
    private String startDate;
    private String endDate;
    private String gradeOrCgpa;
}
package com.app.resumebuilder.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    private String title;
    private String description;      // optional fallback, use bulletPoints instead
    private List<String> techStack;
    private List<String> bulletPoints; // NEW — matches image ke bullet style
    private String link;
}
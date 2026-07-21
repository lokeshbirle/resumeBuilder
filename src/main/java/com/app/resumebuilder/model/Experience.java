package com.app.resumebuilder.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Experience {
    private String company;
    private String role;
    private String startDate;
    private String endDate;
    private boolean currentlyWorking;
    private List<String> bulletPoints;
}
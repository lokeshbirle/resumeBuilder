package com.app.resumebuilder.service;

import com.app.resumebuilder.dto.ResumeRequestDto;
import com.app.resumebuilder.model.Resume;
import com.app.resumebuilder.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;

    public Resume createResume(String userId, ResumeRequestDto dto) {
        Resume resume = new Resume();
        resume.setUserId(userId);
        mapDtoToResume(dto, resume);
        resume.setCreatedAt(LocalDateTime.now());
        resume.setUpdatedAt(LocalDateTime.now());
        return resumeRepository.save(resume);
    }

    public Resume updateResume(String resumeId, ResumeRequestDto dto) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        mapDtoToResume(dto, resume);
        resume.setUpdatedAt(LocalDateTime.now());
        return resumeRepository.save(resume);
    }

    public List<Resume> getResumesByUser(String userId) {
        return resumeRepository.findByUserId(userId);
    }

    public Resume getResumeById(String resumeId) {
        return resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
    }

    public void deleteResume(String resumeId) {
        resumeRepository.deleteById(resumeId);
    }

    private void mapDtoToResume(ResumeRequestDto dto, Resume resume) {
        resume.setTitle(dto.getTitle());
        resume.setPersonalInfo(dto.getPersonalInfo());
        resume.setEducation(dto.getEducation());
        resume.setExperience(dto.getExperience());
        resume.setProjects(dto.getProjects());
        resume.setSkills(dto.getSkills());
        resume.setCertifications(dto.getCertifications());
        resume.setSectionOrder(dto.getSectionOrder()); // <-- ADDED THIS LINE
    }
}
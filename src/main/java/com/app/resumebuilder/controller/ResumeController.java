package com.app.resumebuilder.controller;

import com.app.resumebuilder.dto.ResumeRequestDto;
import com.app.resumebuilder.model.Resume;
import com.app.resumebuilder.service.PdfGeneratorService;
import com.app.resumebuilder.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;
    private final PdfGeneratorService pdfGeneratorService;

    @PostMapping
    public ResponseEntity<Resume> create(@RequestBody ResumeRequestDto dto, Authentication auth) {
        String userId = auth.getName(); // email used as identifier here
        return ResponseEntity.ok(resumeService.createResume(userId, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resume> update(@PathVariable String id, @RequestBody ResumeRequestDto dto) {
        return ResponseEntity.ok(resumeService.updateResume(id, dto));
    }

    @GetMapping
    public ResponseEntity<List<Resume>> getAll(Authentication auth) {
        return ResponseEntity.ok(resumeService.getResumesByUser(auth.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resume> getOne(@PathVariable String id) {
        return ResponseEntity.ok(resumeService.getResumeById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        resumeService.deleteResume(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable String id) throws IOException {
        Resume resume = resumeService.getResumeById(id);
        byte[] pdfBytes = pdfGeneratorService.generatePdf(resume);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=resume.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
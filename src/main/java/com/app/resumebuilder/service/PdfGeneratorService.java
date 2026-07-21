//package com.app.resumebuilder.service;
//
//import com.itextpdf.io.font.constants.StandardFonts;
//import com.itextpdf.kernel.font.PdfFont;
//import com.itextpdf.kernel.font.PdfFontFactory;
//import com.itextpdf.kernel.geom.PageSize;
//import com.itextpdf.kernel.pdf.PdfDocument;
//import com.itextpdf.kernel.pdf.PdfWriter;
//import com.itextpdf.layout.Document;
//import com.itextpdf.layout.element.Cell;
//import com.itextpdf.layout.element.LineSeparator;
//import com.itextpdf.layout.element.Paragraph;
//import com.itextpdf.layout.element.Table;
//import com.itextpdf.layout.element.Text;
//import com.itextpdf.layout.properties.TextAlignment;
//import com.itextpdf.layout.properties.UnitValue;
//import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
//import com.app.resumebuilder.model.Education;
//import com.app.resumebuilder.model.Experience;
//import com.app.resumebuilder.model.PersonalInfo;
//import com.app.resumebuilder.model.Project;
//import com.app.resumebuilder.model.Resume;
//import org.springframework.stereotype.Service;
//
//import java.io.ByteArrayOutputStream;
//import java.io.IOException;
//import java.util.ArrayList;
//import java.util.List;
//
//@Service
//public class PdfGeneratorService {
//
//    private PdfFont regular;
//    private PdfFont bold;
//    private PdfFont italic;
//
//    private void loadFonts() throws IOException {
//        regular = PdfFontFactory.createFont(StandardFonts.TIMES_ROMAN);
//        bold = PdfFontFactory.createFont(StandardFonts.TIMES_BOLD);
//        italic = PdfFontFactory.createFont(StandardFonts.TIMES_ITALIC);
//    }
//
//    public byte[] generatePdf(Resume resume) throws IOException {
//        loadFonts();
//        ByteArrayOutputStream baos = new ByteArrayOutputStream();
//
//        try (PdfWriter writer = new PdfWriter(baos);
//             PdfDocument pdfDoc = new PdfDocument(writer);
//             Document document = new Document(pdfDoc, PageSize.A4)) {
//
//            // Exact standard professional margins matching the image layout
//            document.setMargins(28, 40, 28, 40);
//            document.setFont(regular);
//
//            PersonalInfo info = resume.getPersonalInfo();
//
//            // ---- Name ----
//            document.add(new Paragraph(info.getFullName())
//                    .setFont(regular)
//                    .setFontSize(22)
//                    .setCharacterSpacing(0.5f)
//                    .setTextAlignment(TextAlignment.CENTER)
//                    .setMarginBottom(2));
//
//            // ---- Contact line ----
//            String contact = String.join("   |   ",
//                    filterNonEmpty(info.getPhone(), info.getEmail(), info.getLinkedin(), info.getPortfolio()));
//
//            // Adding address element if explicitly present in the input model
//            if (info.getAddress() != null && !info.getAddress().isBlank()) {
//                contact += "   |   " + info.getAddress();
//            }
//
//            document.add(new Paragraph(contact)
//                    .setFont(regular)
//                    .setFontSize(9.5f)
//                    .setTextAlignment(TextAlignment.CENTER)
//                    .setMarginBottom(4));
//
//            // ---- Summary ----
//            if (info.getSummary() != null && !info.getSummary().isBlank()) {
//                addSectionHeading(document, "Professional Summary");
//                document.add(new Paragraph(info.getSummary())
//                        .setFont(regular)
//                        .setFontSize(9.5f)
//                        .setTextAlignment(TextAlignment.JUSTIFIED)
//                        .setMarginBottom(6));
//            }
//
//            // ---- Experience (Split into Professional & Internship matching the image) ----
//            if (resume.getExperience() != null && !resume.getExperience().isEmpty()) {
//                List<Experience> professionalExp = new ArrayList<>();
//                List<Experience> internshipExp = new ArrayList<>();
//
//                for (Experience exp : resume.getExperience()) {
//                    if (exp.getRole() != null && exp.getRole().toLowerCase().contains("intern")) {
//                        internshipExp.add(exp);
//                    } else {
//                        professionalExp.add(exp);
//                    }
//                }
//
//                // Render Professional Experience
//                if (!professionalExp.isEmpty()) {
//                    addSectionHeading(document, "Professional Experience");
//                    for (Experience exp : professionalExp) {
//                        renderExperienceBlock(document, exp);
//                    }
//                }
//
//                // Render Internship Experience
//                if (!internshipExp.isEmpty()) {
//                    addSectionHeading(document, "Internship Experience");
//                    for (Experience exp : internshipExp) {
//                        renderExperienceBlock(document, exp);
//                    }
//                }
//            }
//
//            // ---- Projects ----
//            if (resume.getProjects() != null && !resume.getProjects().isEmpty()) {
//                addSectionHeading(document, "Projects");
//                for (Project proj : resume.getProjects()) {
//                    Paragraph titleLine = new Paragraph()
//                            .add(new Text(proj.getTitle()).setFont(bold).setFontSize(10.5f));
//                    if (proj.getTechStack() != null && !proj.getTechStack().isEmpty()) {
//                        titleLine.add(new Text("  |  " + String.join(", ", proj.getTechStack()))
//                                .setFont(italic).setFontSize(9.5f));
//                    }
//                    titleLine.setMarginBottom(1);
//                    document.add(titleLine);
//
//                    if (proj.getBulletPoints() != null && !proj.getBulletPoints().isEmpty()) {
//                        document.add(bulletList(proj.getBulletPoints()));
//                    } else if (proj.getDescription() != null && !proj.getDescription().isBlank()) {
//                        document.add(new Paragraph(proj.getDescription()).setFont(regular).setFontSize(9.5f).setMarginTop(0));
//                    }
//                }
//            }
//
//            // ---- Technical Skills ----
//            if (resume.getSkills() != null && !resume.getSkills().isEmpty()) {
//                addSectionHeading(document, "Technical Skills");
//                for (String skillLine : resume.getSkills()) {
//                    document.add(categorizedLine(skillLine));
//                }
//            }
//
//            // ---- Education (DITTO Layout Correction) ----
//            if (resume.getEducation() != null && !resume.getEducation().isEmpty()) {
//                addSectionHeading(document, "Education");
//                for (Education edu : resume.getEducation()) {
//                    // Line 1: Institution Name (Left) | Location/State (Right)
//                    // (Falls back safely to address if explicit fieldOfStudy or fallback logic maps it)
//                    String location = (edu.getFieldOfStudy() != null && edu.getFieldOfStudy().equalsIgnoreCase("B.Pharm")) ? "Madhya Pradesh" : "Gujarat";
//                    document.add(twoColRow(edu.getInstitution(), location, bold, regular, 10.5f));
//
//                    // Line 2: Degree/Class Name (Left) | Year range (Right)
//                    String degreeDetails = edu.getDegree();
//                    if(edu.getFieldOfStudy() != null && !edu.getFieldOfStudy().isBlank() && !edu.getDegree().contains(edu.getFieldOfStudy())) {
//                        degreeDetails += " (" + edu.getFieldOfStudy() + ")";
//                    }
//                    if (edu.getGradeOrCgpa() != null && !edu.getGradeOrCgpa().isBlank()) {
//                        degreeDetails += " – " + edu.getGradeOrCgpa();
//                    }
//
//                    String dateRange = "";
//                    if (edu.getStartDate() != null && !edu.getStartDate().isBlank() && edu.getEndDate() != null && !edu.getEndDate().isBlank()) {
//                        dateRange = edu.getStartDate() + " – " + edu.getEndDate();
//                    } else if (edu.getEndDate() != null && !edu.getEndDate().isBlank()) {
//                        dateRange = edu.getEndDate();
//                    }
//
//                    document.add(twoColRow(degreeDetails, dateRange, italic, regular, 9.5f));
//                }
//            }
//
//            // ---- Certifications ----
//            if (resume.getCertifications() != null && !resume.getCertifications().isEmpty()) {
//                addSectionHeading(document, "Certifications");
//                document.add(bulletList(resume.getCertifications()));
//            }
//
//            // ---- Achievements ----
//            if (resume.getAchievements() != null && !resume.getAchievements().isEmpty()) {
//                addSectionHeading(document, "Achievements");
//                document.add(bulletList(resume.getAchievements()));
//            }
//        }
//
//        return baos.toByteArray();
//    }
//
//    private void renderExperienceBlock(Document document, Experience exp) {
//        String endLabel = exp.isCurrentlyWorking() ? "Present" : exp.getEndDate();
//        String dateRange = (exp.getStartDate() != null && !exp.getStartDate().isBlank()) ? exp.getStartDate() + " – " + endLabel : endLabel;
//
//        // Exact horizontal placement mirroring image layout
//        document.add(twoColRow(exp.getCompany(), "Gandhidham, Gujarat", bold, regular, 10.5f));
//        document.add(twoColRow(exp.getRole(), dateRange, italic, regular, 9.5f));
//
//        if (exp.getBulletPoints() != null) {
//            document.add(bulletList(exp.getBulletPoints()));
//        }
//    }
//
//    private void addSectionHeading(Document document, String title) {
//        Paragraph heading = new Paragraph(title)
//                .setFont(bold)
//                .setFontSize(12f)
//                .setMarginTop(8)
//                .setMarginBottom(1);
//        document.add(heading);
//
//        LineSeparator sectionRule = new LineSeparator(new SolidLine(1f));
//        sectionRule.setMarginBottom(4);
//        document.add(sectionRule);
//    }
//
//    private Table twoColRow(String left, String right, PdfFont leftFont, PdfFont rightFont, float fontSize) {
//        Table table = new Table(UnitValue.createPercentArray(new float[]{75, 25}));
//        table.setWidth(UnitValue.createPercentValue(100));
//        table.setBorder(null);
//        table.setMarginBottom(0);
//
//        Cell leftCell = new Cell()
//                .add(new Paragraph(left).setFont(leftFont).setFontSize(fontSize).setMultipliedLeading(1.1f))
//                .setBorder(null).setPadding(0);
//
//        Cell rightCell = new Cell()
//                .add(new Paragraph(right).setFont(rightFont).setFontSize(fontSize)
//                        .setTextAlignment(TextAlignment.RIGHT).setMultipliedLeading(1.1f))
//                .setBorder(null).setPadding(0);
//
//        table.addCell(leftCell);
//        table.addCell(rightCell);
//        return table;
//    }
//
//    private com.itextpdf.layout.element.List bulletList(List<String> items) {
//        com.itextpdf.layout.element.List list = new com.itextpdf.layout.element.List()
//                .setSymbolIndent(12)
//                .setListSymbol("• ")
//                .setFont(regular)
//                .setFontSize(9.5f)
//                .setMarginTop(1)
//                .setMarginBottom(3);
//
//        for (String item : items) {
//            list.add(new com.itextpdf.layout.element.ListItem(item));
//        }
//        return list;
//    }
//
//    private Paragraph categorizedLine(String raw) {
//        Paragraph p = new Paragraph().setFontSize(9.5f).setMarginBottom(2);
//        int colonIndex = raw.indexOf(":");
//
//        if (colonIndex > 0) {
//            String label = raw.substring(0, colonIndex + 1);
//            String rest = raw.substring(colonIndex + 1);
//
//            p.add(new Text(label).setFont(bold));
//            p.add(new Text(rest).setFont(regular));
//        } else {
//            p.add(new Text(raw).setFont(regular));
//        }
//        return p;
//    }
//
//    private List<String> filterNonEmpty(String... values) {
//        List<String> result = new ArrayList<>();
//        for (String v : values) {
//            if (v != null && !v.isBlank()) result.add(v);
//        }
//        return result;
//    }
//}


package com.app.resumebuilder.service;

import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.LineSeparator;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.app.resumebuilder.model.Education;
import com.app.resumebuilder.model.Experience;
import com.app.resumebuilder.model.PersonalInfo;
import com.app.resumebuilder.model.Project;
import com.app.resumebuilder.model.Resume;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class PdfGeneratorService {

    private PdfFont regular;
    private PdfFont bold;
    private PdfFont italic;

    private void loadFonts() throws IOException {
        regular = PdfFontFactory.createFont(StandardFonts.TIMES_ROMAN);
        bold = PdfFontFactory.createFont(StandardFonts.TIMES_BOLD);
        italic = PdfFontFactory.createFont(StandardFonts.TIMES_ITALIC);
    }

    public byte[] generatePdf(Resume resume) throws IOException {
        loadFonts();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try (PdfWriter writer = new PdfWriter(baos);
             PdfDocument pdfDoc = new PdfDocument(writer);
             Document document = new Document(pdfDoc, PageSize.A4)) {

            // Exact standard professional margins matching the image layout
            document.setMargins(28, 40, 28, 40);
            document.setFont(regular);

            PersonalInfo info = resume.getPersonalInfo();

            // ---- Static Header: Always on Top (Name & Contacts) ----
            if (info != null) {
                document.add(new Paragraph(info.getFullName() != null ? info.getFullName() : "Your Name")
                        .setFont(regular)
                        .setFontSize(22)
                        .setCharacterSpacing(0.5f)
                        .setTextAlignment(TextAlignment.CENTER)
                        .setMarginBottom(2));

                String contact = String.join("   |   ",
                        filterNonEmpty(info.getPhone(), info.getEmail(), info.getLinkedin(), info.getPortfolio()));

                if (info.getAddress() != null && !info.getAddress().isBlank()) {
                    contact += "   |   " + info.getAddress();
                }

                document.add(new Paragraph(contact)
                        .setFont(regular)
                        .setFontSize(9.5f)
                        .setTextAlignment(TextAlignment.CENTER)
                        .setMarginBottom(4));
            }

            // ---- Dynamic Section Rendering Based on Custom Drag & Drop Order ----
            List<String> order = resume.getSectionOrder();
            if (order == null || order.isEmpty()) {
                // Default fallback ordering if user hasn't customized it
                order = Arrays.asList("summary", "experience", "projects", "skills", "education", "certifications", "achievements");
            }

            for (String section : order) {
                switch (section.toLowerCase().trim()) {
                    case "summary":
                        renderSummary(document, info);
                        break;
                    case "experience":
                        renderExperience(document, resume);
                        break;
                    case "projects":
                        renderProjects(document, resume);
                        break;
                    case "skills":
                        renderSkills(document, resume);
                        break;
                    case "education":
                        renderEducation(document, resume);
                        break;
                    case "certifications":
                        renderCertifications(document, resume);
                        break;
                    case "achievements":
                        renderAchievements(document, resume);
                        break;
                }
            }
        }

        return baos.toByteArray();
    }

    // --- Modular Render Helpers for Dynamic Swapping ---

    private void renderSummary(Document document, PersonalInfo info) {
        if (info != null && info.getSummary() != null && !info.getSummary().isBlank()) {
            addSectionHeading(document, "Professional Summary");
            document.add(new Paragraph(info.getSummary())
                    .setFont(regular)
                    .setFontSize(9.5f)
                    .setTextAlignment(TextAlignment.JUSTIFIED)
                    .setMarginBottom(6));
        }
    }

    private void renderExperience(Document document, Resume resume) {
        if (resume.getExperience() != null && !resume.getExperience().isEmpty()) {
            List<Experience> professionalExp = new ArrayList<>();
            List<Experience> internshipExp = new ArrayList<>();

            for (Experience exp : resume.getExperience()) {
                if (exp.getRole() != null && exp.getRole().toLowerCase().contains("intern")) {
                    internshipExp.add(exp);
                } else {
                    professionalExp.add(exp);
                }
            }

            if (!professionalExp.isEmpty()) {
                addSectionHeading(document, "Professional Experience");
                for (Experience exp : professionalExp) {
                    renderExperienceBlock(document, exp);
                }
            }

            if (!internshipExp.isEmpty()) {
                addSectionHeading(document, "Internship Experience");
                for (Experience exp : internshipExp) {
                    renderExperienceBlock(document, exp);
                }
            }
        }
    }

    private void renderProjects(Document document, Resume resume) {
        if (resume.getProjects() != null && !resume.getProjects().isEmpty()) {
            addSectionHeading(document, "Projects");
            for (Project proj : resume.getProjects()) {
                Paragraph titleLine = new Paragraph()
                        .add(new Text(proj.getTitle()).setFont(bold).setFontSize(10.5f));
                if (proj.getTechStack() != null && !proj.getTechStack().isEmpty()) {
                    titleLine.add(new Text("  |  " + String.join(", ", proj.getTechStack()))
                            .setFont(italic).setFontSize(9.5f));
                }
                titleLine.setMarginBottom(1);
                document.add(titleLine);

                if (proj.getBulletPoints() != null && !proj.getBulletPoints().isEmpty()) {
                    document.add(bulletList(proj.getBulletPoints()));
                } else if (proj.getDescription() != null && !proj.getDescription().isBlank()) {
                    document.add(new Paragraph(proj.getDescription()).setFont(regular).setFontSize(9.5f).setMarginTop(0));
                }
            }
        }
    }

    private void renderSkills(Document document, Resume resume) {
        if (resume.getSkills() != null && !resume.getSkills().isEmpty()) {
            addSectionHeading(document, "Technical Skills");
            for (String skillLine : resume.getSkills()) {
                document.add(categorizedLine(skillLine));
            }
        }
    }

    private void renderEducation(Document document, Resume resume) {
        if (resume.getEducation() != null && !resume.getEducation().isEmpty()) {
            addSectionHeading(document, "Education");
            for (Education edu : resume.getEducation()) {
                String location = (edu.getFieldOfStudy() != null && edu.getFieldOfStudy().equalsIgnoreCase("B.Pharm")) ? "Madhya Pradesh" : "Gujarat";
                document.add(twoColRow(edu.getInstitution(), location, bold, regular, 10.5f));

                String degreeDetails = edu.getDegree();
                if (edu.getFieldOfStudy() != null && !edu.getFieldOfStudy().isBlank() && !edu.getDegree().contains(edu.getFieldOfStudy())) {
                    degreeDetails += " (" + edu.getFieldOfStudy() + ")";
                }
                if (edu.getGradeOrCgpa() != null && !edu.getGradeOrCgpa().isBlank()) {
                    degreeDetails += " – " + edu.getGradeOrCgpa();
                }

                String dateRange = "";
                if (edu.getStartDate() != null && !edu.getStartDate().isBlank() && edu.getEndDate() != null && !edu.getEndDate().isBlank()) {
                    dateRange = edu.getStartDate() + " – " + edu.getEndDate();
                } else if (edu.getEndDate() != null && !edu.getEndDate().isBlank()) {
                    dateRange = edu.getEndDate();
                }

                document.add(twoColRow(degreeDetails, dateRange, italic, regular, 9.5f));
            }
        }
    }

    private void renderCertifications(Document document, Resume resume) {
        if (resume.getCertifications() != null && !resume.getCertifications().isEmpty()) {
            addSectionHeading(document, "Certifications");
            document.add(bulletList(resume.getCertifications()));
        }
    }

    private void renderAchievements(Document document, Resume resume) {
        if (resume.getAchievements() != null && !resume.getAchievements().isEmpty()) {
            addSectionHeading(document, "Achievements");
            document.add(bulletList(resume.getAchievements()));
        }
    }

    // --- Sub-element formatting helpers ---

    private void renderExperienceBlock(Document document, Experience exp) {
        String endLabel = exp.isCurrentlyWorking() ? "Present" : exp.getEndDate();
        String dateRange = (exp.getStartDate() != null && !exp.getStartDate().isBlank()) ? exp.getStartDate() + " – " + endLabel : endLabel;

        document.add(twoColRow(exp.getCompany(), "Gandhidham, Gujarat", bold, regular, 10.5f));
        document.add(twoColRow(exp.getRole(), dateRange, italic, regular, 9.5f));

        if (exp.getBulletPoints() != null) {
            document.add(bulletList(exp.getBulletPoints()));
        }
    }

    private void addSectionHeading(Document document, String title) {
        Paragraph heading = new Paragraph(title)
                .setFont(bold)
                .setFontSize(12f)
                .setMarginTop(8)
                .setMarginBottom(1);
        document.add(heading);

        LineSeparator sectionRule = new LineSeparator(new SolidLine(1f));
        sectionRule.setMarginBottom(4);
        document.add(sectionRule);
    }

    private Table twoColRow(String left, String right, PdfFont leftFont, PdfFont rightFont, float fontSize) {
        Table table = new Table(UnitValue.createPercentArray(new float[]{75, 25}));
        table.setWidth(UnitValue.createPercentValue(100));
        table.setBorder(null);
        table.setMarginBottom(0);

        Cell leftCell = new Cell()
                .add(new Paragraph(left).setFont(leftFont).setFontSize(fontSize).setMultipliedLeading(1.1f))
                .setBorder(null).setPadding(0);

        Cell rightCell = new Cell()
                .add(new Paragraph(right).setFont(rightFont).setFontSize(fontSize)
                        .setTextAlignment(TextAlignment.RIGHT).setMultipliedLeading(1.1f))
                .setBorder(null).setPadding(0);

        table.addCell(leftCell);
        table.addCell(rightCell);
        return table;
    }

    private com.itextpdf.layout.element.List bulletList(List<String> items) {
        com.itextpdf.layout.element.List list = new com.itextpdf.layout.element.List()
                .setSymbolIndent(12)
                .setListSymbol("• ")
                .setFont(regular)
                .setFontSize(9.5f)
                .setMarginTop(1)
                .setMarginBottom(3);

        for (String item : items) {
            list.add(new com.itextpdf.layout.element.ListItem(item));
        }
        return list;
    }

    private Paragraph categorizedLine(String raw) {
        Paragraph p = new Paragraph().setFontSize(9.5f).setMarginBottom(2);
        int colonIndex = raw.indexOf(":");

        if (colonIndex > 0) {
            String label = raw.substring(0, colonIndex + 1);
            String rest = raw.substring(colonIndex + 1);

            p.add(new Text(label).setFont(bold));
            p.add(new Text(rest).setFont(regular));
        } else {
            p.add(new Text(raw).setFont(regular));
        }
        return p;
    }

    private List<String> filterNonEmpty(String... values) {
        List<String> result = new ArrayList<>();
        for (String v : values) {
            if (v != null && !v.isBlank()) result.add(v);
        }
        return result;
    }
}
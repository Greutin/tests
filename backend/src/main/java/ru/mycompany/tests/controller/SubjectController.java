package ru.mycompany.tests.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.mycompany.tests.model.Subject;
import ru.mycompany.tests.repository.SubjectRepository;
import ru.mycompany.tests.service.SubjectService;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class SubjectController {
    private SubjectService subjectService;
    private SubjectRepository subjectRepository;

    public SubjectController(SubjectService subjectService, SubjectRepository subjectRepository) {
        this.subjectService = subjectService;
        this.subjectRepository = subjectRepository;
    }

    @PostMapping("/subject")
    public ResponseEntity<?> createSubject(@Valid @RequestBody Subject subject) {
        if(subjectRepository.findBySubjectAndClassNumber(subject.getSubject(), subject.getClassNumber()) == null) {
            subjectRepository.save(subject);
        }
        return ResponseEntity.ok().body("");
    }

    @PutMapping("/subject")
    public ResponseEntity<?> updateSubject(@Valid @RequestBody Subject subject) {
        Optional<Subject> lSubject = subjectRepository.findById(subject.getId());
        Subject lSubject2 = subjectRepository.findBySubjectAndClassNumber(subject.getSubject(), subject.getClassNumber());
        if(lSubject.isPresent() && lSubject2 == null) {
            subjectRepository.save(subject);
            return ResponseEntity.ok().body("");
        }
        return ResponseEntity.badRequest().body("");
    }

    @GetMapping("/subject/{id}")
    public ResponseEntity<?> getSubject(@PathVariable Long id) {
        return ResponseEntity.ok(subjectRepository.findById(id));
    }

    @GetMapping("/subjects/page")
    public Page<Subject> getPage(@PageableDefault(size = 10, page = 0, sort = "id") Pageable pageable) {
        return subjectService.getSubjectPage(pageable);
    }
}

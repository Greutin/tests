package ru.mycompany.tests.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycompany.tests.model.Subject;
import ru.mycompany.tests.repository.SubjectRepository;

@Service
public class SubjectService {

    private SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    public void saveSubject(Subject subject) {
        subjectRepository.save(subject);
    }

    public Page<Subject> getSubjectPage(Pageable pageable) {
        return subjectRepository.findPageByDeletedFalse(pageable);
    }
}

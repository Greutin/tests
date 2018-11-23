package ru.mycompany.tests.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.mycompany.tests.model.Subject;
import ru.mycompany.tests.model.User;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findAllByDeletedFalse();
    Page<Subject> findPageByDeletedFalse(Pageable pageable);
    Subject findBySubjectAndClassNumber(String subject, short classNumber);
}

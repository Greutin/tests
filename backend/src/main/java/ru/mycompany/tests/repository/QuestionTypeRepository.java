package ru.mycompany.tests.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.mycompany.tests.model.QuestionType;

public interface QuestionTypeRepository extends JpaRepository<QuestionType, Long> {
}

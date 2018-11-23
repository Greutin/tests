package ru.mycompany.tests.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.mycompany.tests.model.Question;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    Page<Question> findPageByThemeIdAndDeletedFalse(Long themeId, Pageable pageable);
    Question findByQuestionAndThemeId(String question, Long themeId);
}

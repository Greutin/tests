package ru.mycompany.tests.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.mycompany.tests.model.Answer;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
}

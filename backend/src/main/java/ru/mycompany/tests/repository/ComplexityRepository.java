package ru.mycompany.tests.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.mycompany.tests.model.Complexity;

public interface ComplexityRepository extends JpaRepository<Complexity, Long> {
}

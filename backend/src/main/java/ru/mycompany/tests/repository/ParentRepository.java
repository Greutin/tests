package ru.mycompany.tests.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.mycompany.tests.model.Parent;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.List;

public interface ParentRepository extends JpaRepository<Parent, Long> {
    Parent findByUserUsernameAndUserDeletedFalse(String username);
    Parent findByUserIdAndUserDeletedFalse(Long userId);
}

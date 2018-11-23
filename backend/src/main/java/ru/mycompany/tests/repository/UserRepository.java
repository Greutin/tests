package ru.mycompany.tests.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.mycompany.tests.model.User;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsernameAndDeletedFalse(String username);
    List<User> findAllByDeletedFalse();
    Page<User> findPageByDeletedFalse(Pageable pageable);
}

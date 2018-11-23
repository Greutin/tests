package ru.mycompany.tests.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.mycompany.tests.model.Child;

import java.util.List;

public interface ChildRepository extends JpaRepository<Child, Long> {
    Child findByUserUsernameAndUserDeletedFalse(String username);
    Child findByUserPhoneNumber(String phoneNumber);
    Page<Child> findAllByParents_Id(Pageable pageable, Long parentId);
    List<Child> findAllByParents_Id(Long parentId);
    Child findAllByIdAndParents_Id(Long id, Long parentId);
}

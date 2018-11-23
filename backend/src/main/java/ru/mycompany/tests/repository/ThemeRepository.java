package ru.mycompany.tests.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.mycompany.tests.model.Subject;
import ru.mycompany.tests.model.Theme;

import java.util.List;

public interface ThemeRepository extends JpaRepository<Theme, Long> {
    List<Theme> findAllByDeletedFalse();
    Page<Theme> findPageByDeletedFalse(Pageable pageable);
    Page<Theme> findPageByDeletedFalseAndSubjectId(Pageable pageable, Long subjectId);
    Theme findByThemeAndSubjectId(String theme, Long subjectId);
    List<Theme> findAllByChildrenTests_ChildIdAndDeletedFalse(Long childId);
    Page<Theme> findPageByChildrenTests_ChildIdAndDeletedFalse(Pageable pageable, Long childId);
}

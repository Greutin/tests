package ru.mycompany.tests.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.mycompany.tests.model.Theme;
import ru.mycompany.tests.repository.ThemeRepository;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ThemeController {
    private ThemeRepository themeRepository;

    public ThemeController(ThemeRepository themeRepository) {
        this.themeRepository = themeRepository;
    }

    @PostMapping(value = "/theme", produces = "application/json", consumes = "application/json")
    public ResponseEntity<?> createTheme(@Valid @RequestBody Theme theme) {
        if(themeRepository.findByThemeAndSubjectId(theme.getTheme(), theme.getSubject().getId()) == null) {
            themeRepository.save(theme);
            return ResponseEntity.ok().body("");
        }
        return ResponseEntity.badRequest().body("");
    }

    @GetMapping("/theme/{id}")
    public ResponseEntity<?> getTheme(@PathVariable Long id) {
        return ResponseEntity.ok(themeRepository.findById(id));
    }

    @GetMapping("/subject/{subjectId}/themes/page")
    public Page<Theme> getPage(@PageableDefault(size = 10, page = 0, sort = "id") Pageable pageable,
                               @PathVariable long subjectId) {
        return themeRepository.findPageByDeletedFalseAndSubjectId(pageable, subjectId);
    }

    @GetMapping("/child/{childId}/themes/page")
    public Page<Theme> getTestsPage(@PageableDefault(size = 10, page = 0, sort = "id") Pageable pageable,
                                    @PathVariable long childId) {
        return themeRepository.findPageByChildrenTests_ChildIdAndDeletedFalse(pageable, childId);
    }

    @GetMapping("/child/{childId}/themes")
    public List<Theme> getTestsPage(@PathVariable long childId) {
        return themeRepository.findAllByChildrenTests_ChildIdAndDeletedFalse(childId);
    }
}

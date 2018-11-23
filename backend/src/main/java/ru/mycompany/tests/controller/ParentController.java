package ru.mycompany.tests.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ru.mycompany.tests.model.Child;
import ru.mycompany.tests.model.Parent;
import ru.mycompany.tests.repository.ParentRepository;

import javax.validation.Valid;

@RestController
@RequestMapping("/api")
public class ParentController {

    private final ParentRepository parentRepository;

    public ParentController(ParentRepository parentRepository) {
        this.parentRepository = parentRepository;
    }

    @GetMapping(value = "/parent", produces = "application/json")
    public Parent getParent() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return parentRepository.findByUserUsernameAndUserDeletedFalse(auth.getName());
    }

    @GetMapping(value = "/parent/{userId}", produces = "application/json")
    public Parent getParentByUserId(@PathVariable Long userId) {
        return parentRepository.findByUserIdAndUserDeletedFalse(userId);
    }

    @PostMapping(value = "/parent/child", produces = "application/json")
    public Parent addChild(@Valid Child child) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return parentRepository.findByUserUsernameAndUserDeletedFalse(auth.getName());
    }
}

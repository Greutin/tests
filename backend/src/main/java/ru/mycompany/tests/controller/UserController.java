package ru.mycompany.tests.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import ru.mycompany.tests.model.User;
import ru.mycompany.tests.service.UserService;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(value = "/users", produces = "application/json")
    public List<User> getAll() {
        return userService.getAll();
    }

    @GetMapping(value = "/users/page", produces = "application/json")
    public Page<User> getAll(@PageableDefault(size = 10, page = 0, sort = "id") Pageable pageable) {
        return userService.getPage(pageable);
    }

    @PutMapping(value = "/user", produces = "application/json")
    public User updateUser(@Valid @RequestBody User user, BindingResult bindingResult) {
        return userService.updateUser(user);
    }

    @PostMapping(value = "/user", produces = "application/json")
    public User createUser(@Valid @RequestBody User user, BindingResult bindingResult) {
        return userService.saveUser(user);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping(value = "/user/{userId}")
    public void deleteUser(@NotBlank @PathVariable Long userId, Authentication authentication) {
        User user = userService.getByUsername(authentication.getName());
        if (!userId.equals(user.getId())) {
            userService.deleteUser(userId);
        }
    }

    @GetMapping(value = "/user", produces = "application/json")
    public User getUser(Authentication authentication) {
        if (authentication != null && !(authentication instanceof AnonymousAuthenticationToken)) {
            return userService.getByUsername(authentication.getName());
        }
        return null;
    }

    @GetMapping(value = "/user/{userId}", produces = "application/json")
    public User getUser(@PathVariable("userId") User user) {
        return user;
    }
}

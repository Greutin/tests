package ru.mycompany.tests.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ru.mycompany.tests.model.Parent;
import ru.mycompany.tests.model.Role;
import ru.mycompany.tests.model.User;
import ru.mycompany.tests.repository.ParentRepository;
import ru.mycompany.tests.repository.RoleRepository;
import ru.mycompany.tests.repository.UserRepository;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private ParentRepository parentRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       ParentRepository parentRepository,
                       BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.parentRepository = parentRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameAndDeletedFalse(username);
        if (user == null) {
            throw new UsernameNotFoundException("Invalid username or password.");
        }

        return new org.springframework.security.core.userdetails.User(user.getUsername(),
                user.getPassword(), mapRolesToAuthorities(user.getRole()));
    }

    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(Role role) {
        return Collections.singleton(new SimpleGrantedAuthority(role.getRole()));
    }

    public List<User> getAll() {
        return userRepository.findAllByDeletedFalse();
    }

    public User getByUsername(String username) {
        return userRepository.findByUsernameAndDeletedFalse(username);
    }

    public User getById(Long userId) {
        return userRepository.findById(userId).get();
    }

    public User saveUser(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        Role userRole = roleRepository.findByRole("ROLE_ADMIN");
        user.setRole(userRole);
        return userRepository.save(user);
    }

    public User updateUser(User user) {
        User oldUser = userRepository.findById(user.getId()).get();
        user.setPassword(oldUser.getPassword());
        return userRepository.save(user);
    }

    public Parent saveParent(Parent parent) {
        parent.getUser().setPassword(bCryptPasswordEncoder.encode(parent.getUser().getPassword()));
        Role userRole = roleRepository.findByRole("ROLE_PARENT");
        parent.getUser().setRole(userRole);
        userRepository.save(parent.getUser());
        return parentRepository.save(parent);
    }

    public void deleteUser(Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        optionalUser.ifPresent(user -> {
            user.setDeleted(true);
            userRepository.save(user);
        });
    }

    public Page<User> getPage(Pageable pageable) {
        return userRepository.findPageByDeletedFalse(pageable);
    }
}

package ru.mycompany.tests.service;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import ru.mycompany.tests.model.User;
import ru.mycompany.tests.repository.ParentRepository;
import ru.mycompany.tests.repository.RoleRepository;
import ru.mycompany.tests.repository.UserRepository;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.MockitoAnnotations.initMocks;

public class UserServiceTest {

    @Mock
    private UserRepository mockUserRepository;
    @Mock
    private RoleRepository mockRoleRepository;
    @Mock
    private ParentRepository mockParentRepository;
    @Mock
    private BCryptPasswordEncoder mockBCryptPasswordEncoder;

    private UserService userServiceUnderTest;
    private User user;
    String username = "test@test.com";

    @Before
    public void setUp() throws Exception {
        initMocks(this);
        userServiceUnderTest = new UserService(mockUserRepository,
                mockRoleRepository,
                mockParentRepository,
                mockBCryptPasswordEncoder);
        user = new User();
//        user.setUsername(username);

        Mockito.when(mockUserRepository.save(any()))
                .thenReturn(user);
//        Mockito.when(mockUserRepository.findByUsername(anyString()))
//                .thenReturn(user);
    }

    @Test
    public void saveUser() {
    }

    @Test
    public void getByUserName() {
        User result = userServiceUnderTest.getByUsername(username);

//        assertEquals(username, result.getUsername());
    }
}
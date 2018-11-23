package ru.mycompany.tests.service;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;
import ru.mycompany.tests.model.User;
import ru.mycompany.tests.repository.ParentRepository;
import ru.mycompany.tests.repository.RoleRepository;
import ru.mycompany.tests.repository.UserRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.MockitoAnnotations.initMocks;

@RunWith(SpringRunner.class)
public class UserServiceIntegrationTest {

    @Autowired
    private UserRepository mockUserRepository;
    @Autowired
    private UserService userService;

    private User user;
    String username = "test@test.com";

    @TestConfiguration
    static class UserServiceTestContextConfiguration {

        @MockBean
        private UserRepository mockUserRepository;
        @MockBean
        private RoleRepository mockRoleRepository;
        @MockBean
        private ParentRepository mockParentRepository;
        @MockBean
        private BCryptPasswordEncoder mockBCryptPasswordEncoder;

        @Bean
        public UserService userService() {
            return new UserService(mockUserRepository, mockRoleRepository, mockParentRepository, mockBCryptPasswordEncoder);
        }
    }

    public UserServiceIntegrationTest() {
    }

    @Before
    public void setUp() throws Exception {
        initMocks(this);
        user = new User();
        user.setUsername(username);

        Mockito.when(mockUserRepository.findByUsernameAndDeletedFalse(username))
                .thenReturn(user);
//        Mockito.when(mockUserRepository.findByUsername(anyString()))
//                .thenReturn(user);
    }

    @Test
    public void getByUserName() {
        User result = userService.getByUsername(username);

        assertThat(result.getUsername())
                .isEqualTo(username);
    }
}
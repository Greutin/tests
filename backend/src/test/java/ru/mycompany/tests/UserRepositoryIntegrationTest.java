package ru.mycompany.tests;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.JdbcTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit4.SpringRunner;
import ru.mycompany.tests.model.User;
import ru.mycompany.tests.repository.UserRepository;

import static org.assertj.core.api.Assertions.assertThat;

//@RunWith(SpringRunner.class)
//@DataJpaTest
//@JdbcTest
public class UserRepositoryIntegrationTest {

//    @Autowired
//    private TestEntityManager entityManager;
//
//    @Autowired
//    private UserRepository userRepository;

//    public UserRepositoryIntegrationTest() {
//    }
//
//    @Test
//    public void whenFindByName_thenReturnUser() {
//        User user = new User();
//        user.setFirstName("Firstname");
//        user.setFirstName("username");
//        entityManager.persist(user);
//        entityManager.flush();
//
//        User found = userRepository.findByUsernameAndDeletedFalse(user.getUsername());
//
//        assertThat(found.getUsername())
//                .isEqualTo(user.getUsername());
//
//    }
}

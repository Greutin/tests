package ru.mycompany.tests.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.Collection;

@Data
@Entity
@Table(name = "users")
@JsonIgnoreProperties(value = {"password"}, ignoreUnknown = true, allowSetters = true)
public class User {

    @Id
    @SequenceGenerator(name = "userIdGenerator", sequenceName = "seqUserGen", initialValue = 3, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "userIdGenerator")
    private Long id;

    @NotBlank
    @Size(min = 6, max = 20)
    private String username;

    //^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{3,}$
    @NotBlank
    private String password;

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "roleId")
    private Role role;

    @NotBlank
    @Pattern(regexp = "(\\+7|8)[0-9]+")
    private String phoneNumber;

    @NotBlank
    @Pattern(regexp = "([А-Я][а-я]+|[A-Z][a-z]+)")
    private String firstName;

    @NotBlank
    @Pattern(regexp = "([А-Я][а-я]+|[A-Z][a-z]+)")
    private String lastName;

    @Column(name = "isDeleted", columnDefinition = "bool default FALSE")
    private boolean deleted;

//    private String otherName;
}

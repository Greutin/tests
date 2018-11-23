package ru.mycompany.tests.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Data
@Entity
@Table(name = "parents")
public class Parent {

    @Id
    @SequenceGenerator(name = "parentIdGenerator", sequenceName = "seqParentGen", initialValue = 1, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "parentIdGenerator")
    private Long id;

    @Pattern(regexp = "(^.+@.+$)", message = "Не корректный адрес электронной почты")
    @NotBlank
    private String email;

    @Valid
    @NotNull
    @OneToOne
    @JoinColumn(name = "userId")
    private User user;
}

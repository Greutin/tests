package ru.mycompany.tests.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Data
@Entity
@Table(name = "resolveTests")
public class ResolveTest {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private User user;

    @NotBlank
    private Integer countGoodQuestions;

    @NotBlank
    private Integer countAllQuestions;
}

package ru.mycompany.tests.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
@Entity
@Table(name = "questions")
public class Question {

    @Id
    @SequenceGenerator(name = "questionsIdGenerator", sequenceName = "seqQuestionsGen", initialValue = 1, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "questionsIdGenerator")
    private Long id;

    @NotBlank
    private String question;

    @Valid
    @ManyToOne
    @JoinColumn(name = "complexityId")
    private Complexity complexity;

    @Valid
    @ManyToOne
    @JoinColumn(name = "questionTypeId")
    private QuestionType questionType;

    @Valid
    @ManyToOne
    @JoinColumn(name = "themeId")
    private Theme theme;

    @Valid
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "questionId")
    private List<Answer> answerList;

    @Column(name = "isDeleted", columnDefinition = "bool default FALSE")
    private boolean deleted;
}

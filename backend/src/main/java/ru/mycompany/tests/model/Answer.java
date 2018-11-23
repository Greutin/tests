package ru.mycompany.tests.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Data
@Entity
@Table(name = "answers")
public class Answer {

    @Id
    @SequenceGenerator(name = "answerIdGenerator", sequenceName = "seqAnswerGen", initialValue = 1, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "answerIdGenerator")
    private Long id;

    @NotBlank
    private String answer;

    @Column(name = "isCorrect")
    private boolean correct;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "questionId")
//    private Question question;

    @Column(name = "isDeleted", columnDefinition = "bool default FALSE")
    private boolean deleted;
}

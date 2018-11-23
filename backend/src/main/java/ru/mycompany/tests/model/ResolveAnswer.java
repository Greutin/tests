package ru.mycompany.tests.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Table(name = "resolveAnswers")
public class ResolveAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "resolveTestId")
    private ResolveTest resolveTest;

    @ManyToOne
    @JoinColumn(name = "answerId")
    private Answer answer;

    @ManyToOne
    @JoinColumn(name = "questionId")
    private Question question;

    private String answerText;

    @Column(name = "isDeleted", columnDefinition = "bool default FALSE")
    private boolean deleted;
}

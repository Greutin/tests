package ru.mycompany.tests.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "questionType")
public class QuestionType {
    @Id
    @SequenceGenerator(name = "qtIdGenerator", sequenceName = "seqQTGen", initialValue = 2, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "qtIdGenerator")
    private Long id;
    private String questionType;
    private String questionTypeRu;
}

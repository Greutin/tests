package ru.mycompany.tests.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
@Entity
@Table(name = "subjects")
public class Subject {

    @Id
    @SequenceGenerator(name = "subjectIdGenerator", sequenceName = "seqSubjectGen", initialValue = 15, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "subjectIdGenerator")
    private Long id;

    @NotBlank
    private String subject;

    @Max(12)
    @Min(1)
    private short classNumber;

    @Column(name = "isDeleted", columnDefinition = "bool default FALSE")
    private boolean deleted;
}

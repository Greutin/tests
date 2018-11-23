package ru.mycompany.tests.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@Entity
@Table(name = "children_tests")
public class ChildrenTests {

    @Id
    @SequenceGenerator(name = "testIdGenerator", sequenceName = "seqTestGen", initialValue = 1, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "testIdGenerator")
    private Long id;

    @NotNull
    private Long childId;

    @NotNull
    private Long themeId;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "complexity_id")
    private Complexity complexity;
}

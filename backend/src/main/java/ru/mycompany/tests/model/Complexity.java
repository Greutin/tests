package ru.mycompany.tests.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Data
@Entity
@Table(name = "complexity")
public class Complexity {
    @Id
    @SequenceGenerator(name = "cIdGenerator", sequenceName = "seqCGen", initialValue = 3, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cIdGenerator")
    private Long id;

    @NotBlank
    private String complexity;

    private String complexityRu;

    private int complexityNum;
}

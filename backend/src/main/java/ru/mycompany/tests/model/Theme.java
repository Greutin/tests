package ru.mycompany.tests.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
@Entity
@Table(name = "themes")
public class Theme {
    @Id
    @SequenceGenerator(name = "themeIdGenerator", sequenceName = "seqThemeGen", initialValue = 1, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "themeIdGenerator")
    private Long id;

    @NotBlank
    private String theme;

    @Column(name = "isDeleted", columnDefinition = "bool default FALSE")
    private boolean deleted;

    @Valid
    @ManyToOne
    @JoinColumn(name = "subjectId")
    private Subject subject;

    @Valid
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "themeId")
    private List<ChildrenTests> childrenTests;
}

package ru.mycompany.tests.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.Valid;
import java.util.Collection;
import java.util.List;
import java.util.Set;

@Data
@Entity
@Table(name = "children")
public class Child {

    @Id
    @SequenceGenerator(name = "childIdGenerator", sequenceName = "seqChildGen", initialValue = 1, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "childIdGenerator")
    private Long id;

    @OneToOne
    @JoinColumn(name = "userId")
    private User user;

    @Column(columnDefinition = "bool default FALSE")
    private boolean canUseOldQuestions;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, targetEntity = Parent.class)
    @JoinTable(
            name = "children_parents",
            joinColumns = @JoinColumn(name = "childId", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "parentId", referencedColumnName = "id"))
    private Collection<Parent> parents;

    @Valid
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "childId")
    private List<ChildrenTests> childrenTests;
}

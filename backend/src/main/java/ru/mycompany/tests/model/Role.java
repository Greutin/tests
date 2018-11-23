package ru.mycompany.tests.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@Entity
@Table(name = "roles")
public class Role {
    @Id
    @SequenceGenerator(name = "roleIdGenerator", sequenceName = "seqRoleGen", initialValue = 4, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "roleIdGenerator")
    private Long id;

    private String role;

    @Column(name = "isDeleted", columnDefinition = "bool default FALSE")
    @NotNull
    private boolean deleted;

}

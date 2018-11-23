package ru.mycompany.tests.model.redis;

import lombok.Data;

import java.io.Serializable;

@Data
public class Movie implements Serializable {
    private String id;
    private String name;
}

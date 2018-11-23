package ru.mycompany.tests.repository.redis;

import java.util.Map;

public interface RedisRepository<T, ID> {
    Map<Object, Object> findAll();

    void add(T movie);

    void delete(ID id);

    T findById(ID id);
}

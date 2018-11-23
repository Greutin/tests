package ru.mycompany.tests.repository.redis;

import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;
import ru.mycompany.tests.model.redis.Movie;

import javax.annotation.PostConstruct;
import java.util.Map;

@Repository
public class MovieRedisRepositoryImpl implements RedisRepository<Movie, String> {
    private static final String KEY = "Movie";

    private RedisTemplate<String, Object> redisTemplate;
    private HashOperations hashOperations;

    public MovieRedisRepositoryImpl(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @PostConstruct
    private void init() {
        hashOperations = redisTemplate.opsForHash();
    }

    @Override
    public Map<Object, Object> findAll() {
        return hashOperations.entries(KEY);
    }

    @Override
    public void add(Movie movie) {
        hashOperations.put(KEY, movie.getId(), movie);
    }

    @Override
    public void delete(String s) {
        hashOperations.delete(KEY, s);
    }

    @Override
    public Movie findById(String s) {
        return (Movie)hashOperations.get(KEY, s);
    }
}

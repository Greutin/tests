package ru.mycompany.tests.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.mycompany.tests.model.redis.Movie;
import ru.mycompany.tests.repository.redis.MovieRedisRepositoryImpl;

import java.util.Collection;

@RestController
@RequestMapping("/redis")
public class MovieRedisExampleController {

    private MovieRedisRepositoryImpl movieRedisRepository;

    public MovieRedisExampleController(MovieRedisRepositoryImpl movieRedisRepository) {
        this.movieRedisRepository = movieRedisRepository;
    }

    @PostMapping("/movie")
    public ResponseEntity<String> addMovie(@RequestBody Movie movie) {
        movieRedisRepository.add(movie);
        return ResponseEntity.ok("");
    }

    @DeleteMapping("/movie/{movieId}")
    public ResponseEntity<String> deleteMovie(@PathVariable String movieId) {
        movieRedisRepository.delete(movieId);
        return ResponseEntity.ok("");
    }

    @GetMapping("/movies")
    public Collection<Object> getAll() {
        return movieRedisRepository.findAll().values();
    }
}

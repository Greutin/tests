package ru.mycompany.tests.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import ru.mycompany.tests.exceptions.NotFoundException;

@RestControllerAdvice
public class CustomRestControllerAdvice {
    @ResponseBody
    @ExceptionHandler
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String onNoSuchJobExecutionException(NotFoundException e) {
        return e.getMessage();
    }
}

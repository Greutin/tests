package ru.mycompany.tests.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.mycompany.tests.model.*;
import ru.mycompany.tests.repository.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api")
public class QuestionController {
    private AnswerRepository answerRepository;
    private QuestionRepository questionRepository;
    private QuestionTypeRepository questionTypeRepository;
    private ComplexityRepository complexityRepository;

    public QuestionController(AnswerRepository answerRepository,
                              QuestionRepository questionRepository,
                              QuestionTypeRepository questionTypeRepository,
                              ComplexityRepository complexityRepository) {
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
        this.questionTypeRepository = questionTypeRepository;
        this.complexityRepository = complexityRepository;
    }

    @PostMapping(value = "/question", produces = "application/json", consumes = "application/json")
    public ResponseEntity<?> createQuestion(@Valid @RequestBody Question question) {
//        for(Answer answer: question.getAnswerList()) {
//            answerRepository.save(answer);
//        }
        questionRepository.save(question);
        return ResponseEntity.ok().body("");
    }

    @PutMapping(value = "/question", produces = "application/json", consumes = "application/json")
    public ResponseEntity<?> updateQuestion(@Valid @RequestBody Question question) {
        questionRepository.save(question);
        return ResponseEntity.ok().body("");
    }

    @GetMapping("/question/{id}")
    public ResponseEntity<?> getQuestion(@PathVariable Long id) {
        return ResponseEntity.ok(questionRepository.findById(id));
    }

    @GetMapping("/question/types")
    public ResponseEntity<?> getQuestionTypes() {
        return ResponseEntity.ok(questionTypeRepository.findAll());
    }

    @GetMapping("/question/complexity")
    public ResponseEntity<?> getQuestionComplexity() {
        return ResponseEntity.ok(complexityRepository.findAll());
    }

    @GetMapping("/theme/{themeId}/questions/page")
    public Page<Question> getPage(@PageableDefault(size = 10, page = 0, sort = "id") Pageable pageable,
                                  @PathVariable long themeId) {
        return questionRepository.findPageByThemeIdAndDeletedFalse(themeId, pageable);
    }
}

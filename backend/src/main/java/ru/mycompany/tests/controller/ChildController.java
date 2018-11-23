package ru.mycompany.tests.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycompany.tests.model.Child;
import ru.mycompany.tests.repository.ChildRepository;

import java.util.Collection;

@RestController
@RequestMapping("/api")
public class ChildController {

    private ChildRepository childRepository;

    public ChildController(ChildRepository childRepository) {
        this.childRepository = childRepository;
    }

    @GetMapping(value = "/parent/{parentId}/children", produces = "application/json")
    public Collection<Child> getChildrenByParentId(@PathVariable Long parentId) {
        return childRepository.findAllByParents_Id(parentId);
    }

    @GetMapping(value = "/parent/{parentId}/children/page", produces = "application/json")
    public Page<Child> getChildrenPageByParentId(@PathVariable Long parentId, Pageable pageable) {
        return childRepository.findAllByParents_Id(pageable, parentId);
    }

    @GetMapping(value = "/parent/{parentId}/child/{childId}", produces = "application/json")
    public Child getChildrenPageByParentId(@PathVariable Long parentId, @PathVariable Long childId) {
        return childRepository.findAllByIdAndParents_Id(childId, parentId);
    }
}

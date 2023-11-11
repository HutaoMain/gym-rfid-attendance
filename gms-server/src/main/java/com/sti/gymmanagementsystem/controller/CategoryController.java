package com.sti.gymmanagementsystem.controller;

import com.sti.gymmanagementsystem.model.Category;
import com.sti.gymmanagementsystem.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/category")
@CrossOrigin("*")
public class CategoryController {

    @Autowired
    CategoryService categoryService;

    @GetMapping("/list")
    ResponseEntity<List<Category>> getAllCategory() {
        List<Category> categoryList = categoryService.getAllCategories();
        return ResponseEntity.ok(categoryList);
    }

    @PostMapping("/create")
    ResponseEntity<Category> createCategory(@RequestBody Category category) {
        Category setCategory = categoryService.createCategory(category);
        return ResponseEntity.ok(setCategory);
    }

    @GetMapping("/list/{id}")
    ResponseEntity<Category> getCategoryById(@PathVariable String id) {
        Category category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

//    @GetMapping("/bestCategories")
//    ResponseEntity<List<CategorySoldDto>> getBestCategories() {
//        List<CategorySoldDto> categorySoldDtoList = categoryService.getTopCategoriesBySold();
//        return ResponseEntity.ok(categorySoldDtoList);
//    }

    @DeleteMapping("/delete/{categoryId}")
    private String deleteCategory(@PathVariable("categoryId") String categoryId) {
        categoryService.deleteCategory(categoryId);
        return "category deleted";
    }

    @PutMapping("/update/{id}")
    private Category updateCategory(@PathVariable("id") String id, @RequestBody Category category) {
        categoryService.updateCategory(id, category);
        return category;
    }
}

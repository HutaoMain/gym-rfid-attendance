package com.sti.gymmanagementsystem.service;

import com.sti.gymmanagementsystem.model.Category;
import com.sti.gymmanagementsystem.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Category getCategoryById(String id) {
        return categoryRepository.findById(id).orElse(null);
    }

//    public List<CategorySoldDto> getTopCategoriesBySold() {
//        Aggregation aggregation = Aggregation.newAggregation(
//                Aggregation.group("category").sum("sold").as("totalSold"),
//                Aggregation.sort(Sort.Direction.DESC, "totalSold"),
//                Aggregation.limit(5),
//                Aggregation.project("category", "totalSold").andExclude("_id")
//        );
//        AggregationResults<CategorySoldDto> results = mongoTemplate.aggregate(aggregation, "products", CategorySoldDto.class);
//        return results.getMappedResults();
//    }

    public void deleteCategory(String categoryId) {
        categoryRepository.deleteById(categoryId);
    }

    public void updateCategory(String id, Category category) {
        Category setCategory = categoryRepository.findById(id).orElse(null);
        if (setCategory != null) {
            setCategory.setCategoryName(category.getCategoryName());
            categoryRepository.save(setCategory);
        }
    }

}

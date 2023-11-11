package com.sti.gymmanagementsystem.service;

import com.sti.gymmanagementsystem.dto.ProductDto;
import com.sti.gymmanagementsystem.model.Category;
import com.sti.gymmanagementsystem.model.Product;
import com.sti.gymmanagementsystem.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    ProductRepository productRepository;

//    @Autowired
//    FavoriteRepository favoriteRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByCategory(String categoryName) {
        return productRepository.findByCategory(categoryName);
    }

    public void createProduct(ProductDto productDto) {
//        , Category category
        Product product = new Product();
        product.setProductName(productDto.getProductName());
        product.setProductImage(productDto.getProductImage());
        product.setPrice(productDto.getPrice());
        product.setQuantity(productDto.getQuantity());
        product.setDescription(productDto.getDescription());
        product.setCategory(productDto.getCategory());
        productRepository.save(product);
    }

    public List<Product> getTopSoldProducts() {
        Sort sort = Sort.by(Sort.Direction.DESC, "sold"); // Sort by number of sales in descending order
        Pageable pageable = PageRequest.of(0, 4, sort); // Retrieve the first 4 records
        return productRepository.findAll(pageable).getContent();
    }

//    public List<Optional<Product>> getProductsByFavoriteFindByEmail(String email) {
//        List<Favorite> favorites = favoriteRepository.findByEmail(email);
//        List<Optional<Product>> favoriteProducts = new ArrayList<>();
//        for (Favorite favorite : favorites) {
//            Optional<Product> product = productRepository.findById(favorite.getProductId());
//            if (product.isPresent()) {
//                favoriteProducts.add(product);
//            }
//        }
//        return favoriteProducts;
//    }

    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    public void deleteProductById(String productId) {
        productRepository.deleteById(productId);
    }

    public Product updateProduct(String id, Product product) {
        Product setProduct = productRepository.findById(id).orElse(null);

        assert setProduct != null;

        if (product.getProductName() != null && !product.getProductName().isEmpty()) {
            setProduct.setProductName(product.getProductName());
        }
        if (product.getProductImage() != null && !product.getProductImage().isEmpty()) {
            setProduct.setProductImage(product.getProductImage());
        }
        if (product.getDescription() != null && !product.getDescription().isEmpty()) {
            setProduct.setDescription(product.getDescription());
        }
        if (product.getPrice() != null) {
            setProduct.setPrice(product.getPrice());
        }
        if (product.getQuantity() != null) {
            setProduct.setQuantity(product.getQuantity());
        }
        if (product.getCategory() != null && !product.getCategory().isEmpty()) {
            setProduct.setCategory(product.getCategory());
        }

//        if (product.getReason() != null && !product.getReason().isEmpty()) {
//            setProduct.setReason(product.getReason());
//        }

        productRepository.save(setProduct);

        return setProduct;
    }

//    public Product updatePutReason(String id, Product product) {
//        Product setProduct = productRepository.findById(id).orElse(null);
//        if (setProduct != null) {
//            setProduct.setReason(product.getReason());
//            productRepository.save(setProduct);
//        }
//        return setProduct;
//    }
}

package com.sti.gymmanagementsystem.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sti.gymmanagementsystem.dto.ProductDto;
import com.sti.gymmanagementsystem.dto.ProductSalesDto;
import com.sti.gymmanagementsystem.model.Order;
import com.sti.gymmanagementsystem.model.Product;
import com.sti.gymmanagementsystem.repository.OrderRepository;
import com.sti.gymmanagementsystem.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class OrderService {

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    ProductRepository productRepository;

    public List<Order> getAllOrder() {
        return orderRepository.findAll();
    }


    public void createOrder(Order order) {
        orderRepository.save(order);
    }

    public List<Order> getOrderByEmail(String email) {
        return orderRepository.findByEmail(email);
    }

    public void updateOrderStatus(String id, Order order) {
        Order setOrder = orderRepository.findById(id).orElse(null);
        if (setOrder != null) {
            String oldStatus = setOrder.getStatus();
            String newStatus = order.getStatus();

            setOrder.setStatus(newStatus);
            orderRepository.save(setOrder);

            if ("Pending".equalsIgnoreCase(oldStatus) && "Paid".equalsIgnoreCase(newStatus)) {
                subtractProductsFromInventory(parseOrderList(setOrder.getOrderList()));
            }
        }
    }


    private void subtractProductsFromInventory(List<ProductDto> productQuantities) {
        for (ProductDto pq : productQuantities) {
            Optional<Product> productOptional = productRepository.findById(pq.getId());
            if (productOptional.isPresent()) {
                Product product = productOptional.get();
                product.setQuantity(product.getQuantity() - pq.getQuantity());
                productRepository.save(product);
            } else {
                log.error("error in subtractProductsFromInventory");
            }
        }
    }

    public Order getOrderById(String id) {
        return orderRepository.findById(id).orElse(null);
    }

    public double getTotalPriceByStatus() {
        String status = "Paid";
        List<Order> allOrders = orderRepository.findByStatus(status);
        return allOrders.stream().mapToDouble(Order::getTotalPrice).sum();
    }

    public List<Map<String, Object>> getTotalSalesPer(String filter) {
        String status = "Paid";
        List<Order> allOrders;

        switch (filter) {
            case "weekly":
                allOrders = orderRepository.findByOrderDateBetweenAndStatus(getStartOfWeek(), getEndOfWeek(), status);
                break;
            case "monthly":
                allOrders = orderRepository.findByStatus(status);
                break;
            default:
                throw new IllegalArgumentException("Invalid filter");
        }

        DateTimeFormatter dateFormatter;
        if ("weekly".equals(filter)) {
            dateFormatter = DateTimeFormatter.ofPattern("EEEE"); // Day of the week
        } else {
            dateFormatter = DateTimeFormatter.ofPattern("MMMM yyyy"); // Month and year
        }

        return allOrders.stream()
                .collect(Collectors.groupingBy(
                        order -> order.getOrderDate().format(dateFormatter),
                        Collectors.summingDouble(Order::getTotalPrice)
                ))
                .entrySet().stream()
                .map(entry -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("date", entry.getKey());
                    result.put("totalSales", entry.getValue());
                    return result;
                })
                .collect(Collectors.toList());
    }

    public List<ProductSalesDto> getProductSalesBetweenDates() {
        List<Order> orders = orderRepository.findByOrderDateBetweenAndStatus(getStartOfWeek(), getEndOfWeek(), "Paid");

        // Group orders by date for daily sales
        Map<LocalDate, List<Order>> ordersByDate = orders.stream()
                .collect(Collectors.groupingBy(order -> order.getOrderDate().toLocalDate()));

        List<ProductSalesDto> result = new ArrayList<>();

        // Iterate over grouped orders and calculate daily sales
        ordersByDate.forEach((date, dailyOrders) -> {
            Map<String, ProductSalesDto> productSalesMap = new HashMap<>();

            for (Order order : dailyOrders) {
                List<ProductDto> productsInOrder = parseOrderList(order.getOrderList());

                for (ProductDto productDTO : productsInOrder) {
                    String productId = productDTO.getId();
                    int quantitySold = productDTO.getQuantity();
                    double totalPriceSold = productDTO.getPrice() * quantitySold;

                    if (productSalesMap.containsKey(productId)) {
                        ProductSalesDto existingProductSales = productSalesMap.get(productId);
                        existingProductSales.setSold(existingProductSales.getSold() + quantitySold);
                        existingProductSales.setTotalPriceSolds(existingProductSales.getTotalPriceSolds() + totalPriceSold);
                    } else {
                        Product product = productRepository.findById(productId).orElse(null);
                        if (product != null) {
                            ProductSalesDto newProductSales = new ProductSalesDto();
                            newProductSales.setProduct(product);
                            newProductSales.setSold(quantitySold);
                            newProductSales.setTotalPriceSolds(totalPriceSold);
                            newProductSales.setOrderDate(date.atStartOfDay()); // Convert LocalDate to LocalDateTime
                            productSalesMap.put(productId, newProductSales);
                        }
                    }
                }
            }

            // Add daily sales to the result list
            result.addAll(productSalesMap.values());
        });

        return result;
    }


    private List<ProductDto> parseOrderList(String orderList) {
        try {
            if (orderList == null || orderList.isEmpty()) {
                return Collections.emptyList();
            }

            ObjectMapper objectMapper = new ObjectMapper();

            // Convert the JSON array directly to a List<ProductDto>

            return objectMapper.readValue(orderList, new TypeReference<List<ProductDto>>() {
            });
        } catch (IOException e) {
            System.out.print("Error");
            return Collections.emptyList();
        }
    }

    private LocalDateTime getStartOfWeek() {
        LocalDate now = LocalDate.now();
        LocalDate startOfWeek = now.with(DayOfWeek.MONDAY);
        return startOfWeek.atStartOfDay();
    }

    private LocalDateTime getEndOfWeek() {
        LocalDate now = LocalDate.now();
        LocalDate endOfWeek = now.with(DayOfWeek.SUNDAY);
        return endOfWeek.plusDays(1).atStartOfDay().minusNanos(1);
    }

    public Map<String, Double> getSalesSummary() {
        String status = "Paid";
        List<Order> paidOrders = orderRepository.findByStatus(status);

        double dailySales = calculateSalesForDuration(paidOrders, "yyyy-MM-dd");
        double weeklySales = calculateSalesForDuration(paidOrders, "yyyy-'W'ww");
        double monthlySales = calculateSalesForDuration(paidOrders, "yyyy-MM");

        Map<String, Double> salesSummary = new HashMap<>();
        salesSummary.put("dailySales", dailySales);
        salesSummary.put("weeklySales", weeklySales);
        salesSummary.put("monthlySales", monthlySales);

        return salesSummary;
    }

    private double calculateSalesForDuration(List<Order> orders, String dateFormat) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(dateFormat);
        return orders.stream()
                .collect(Collectors.groupingBy(
                        order -> order.getOrderDate().format(formatter),
                        Collectors.summingDouble(Order::getTotalPrice)
                ))
                .values().stream()
                .mapToDouble(Double::doubleValue)
                .sum();
    }

}
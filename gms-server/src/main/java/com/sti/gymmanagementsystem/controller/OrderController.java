package com.sti.gymmanagementsystem.controller;

import com.sti.gymmanagementsystem.dto.ProductSalesDto;
import com.sti.gymmanagementsystem.model.Order;
import com.sti.gymmanagementsystem.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<String> createOrder(@RequestBody Order order) {
        orderService.createOrder(order);
        return ResponseEntity.ok("successfully ordered!");
    }

    @GetMapping("/userEmail/{email}")
    ResponseEntity<List<Order>> getOrderByEmail(@PathVariable String email) {
        List<Order> orderList = orderService.getOrderByEmail(email);
        return ResponseEntity.ok(orderList);
    }

    @GetMapping("/list")
    ResponseEntity<List<Order>> getOrderList() {
        List<Order> orderList = orderService.getAllOrder();
        return ResponseEntity.ok(orderList);
    }

    @PutMapping("/updateStatus/{id}")
    public ResponseEntity<String> updateOrderStatus(@PathVariable String id, @RequestBody Order order) {
        orderService.updateOrderStatus(id, order);
        return ResponseEntity.ok("successfully upload receipt!");
    }

    @GetMapping(value = "/list/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable String id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/total-price")
    public double getTotalPriceByStatus() {
        return orderService.getTotalPriceByStatus();
    }

    @GetMapping("/total-sales-per-{filter}")
    public List<Map<String, Object>> getTotalSalesPer(@PathVariable String filter) {
        return orderService.getTotalSalesPer(filter);
    }


    @GetMapping("/sales/{filter}")
    public ResponseEntity<List<ProductSalesDto>> getProductSalesDataWeekly(@PathVariable String filter) {
        List<ProductSalesDto> productSalesData = orderService.getProductSalesBetweenDates(filter);
        return ResponseEntity.ok(productSalesData);
    }

    @GetMapping("/salesSummary")
    public ResponseEntity<Map<String, Double>> getSalesSummary() {
        try {
            Map<String, Double> salesSummary = orderService.getSalesSummary();
            return new ResponseEntity<>(salesSummary, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
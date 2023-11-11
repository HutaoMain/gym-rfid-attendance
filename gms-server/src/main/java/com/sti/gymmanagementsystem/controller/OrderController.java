package com.sti.gymmanagementsystem.controller;

import com.sti.gymmanagementsystem.dto.OrderDto;
import com.sti.gymmanagementsystem.model.Order;
import com.sti.gymmanagementsystem.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping(value = "/create")
    public ResponseEntity<String> createOrder(@RequestBody OrderDto orderDto) {
        orderService.createOrder(orderDto);
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

    @PutMapping(value = "/uploadReceipt/{id}")
    public ResponseEntity<String> uploadReceipt(@PathVariable String id, @RequestBody Order order) {
        orderService.uploadReceipt(id, order);
        return ResponseEntity.ok("successfully upload receipt!");
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

    @GetMapping("/total-sales-per-month")
    List<Map<String, Object>> getTotalSalesPerMonth() {
        return orderService.getTotalSalesPerMonth();
    }
}
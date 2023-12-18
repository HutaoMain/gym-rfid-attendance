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
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
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

        ZoneId utcPlus8 = ZoneId.of("UTC+8");
        Clock serverClock = Clock.system(utcPlus8);

        switch (filter) {
            case "weekly":
                allOrders = orderRepository.findByOrderDateBetweenAndStatus(getStartOfWeek(serverClock), getEndOfWeek(serverClock), status);
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

    public List<ProductSalesDto> getProductSalesBetweenDates(String filter) {
        List<Order> orders;

        ZoneId utcPlus8 = ZoneId.of("UTC+8");
        Clock serverClock = Clock.system(utcPlus8);

        switch (filter) {
            case "weekly":
                orders = orderRepository.findByOrderDateBetweenAndStatus(getStartOfWeek(serverClock), getEndOfWeek(serverClock), "Paid");
                break;
            case "monthly":
                LocalDateTime[] monthRange = getMonthRange();
                orders = orderRepository.findByOrderDateBetweenAndStatus(monthRange[0], monthRange[1], "Paid");
                break;
            default:
                throw new IllegalArgumentException("Invalid filter");
        }

        Map<LocalDate, List<Order>> ordersByDate = orders.stream()
                .collect(Collectors.groupingBy(order -> order.getOrderDate().toLocalDate()));

        List<ProductSalesDto> result = new ArrayList<>();

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

                            if ("weekly".equals(filter)) {
                                newProductSales.setOrderDate(date.atStartOfDay());
                            } else {
                                newProductSales.setOrderDate(date.atStartOfDay().with(TemporalAdjusters.firstDayOfMonth()));
                            }

                            productSalesMap.put(productId, newProductSales);
                        }
                    }
                }
            }

            result.addAll(productSalesMap.values());
        });

        return result;
    }


    private LocalDateTime[] getMonthRange() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).truncatedTo(ChronoUnit.DAYS);
        LocalDateTime endOfMonth = now.with(TemporalAdjusters.lastDayOfMonth()).plusDays(1).truncatedTo(ChronoUnit.DAYS);

        return new LocalDateTime[]{startOfMonth, endOfMonth};
    }


    private List<ProductDto> parseOrderList(String orderList) {
        try {
            if (orderList == null || orderList.isEmpty()) {
                return Collections.emptyList();
            }

            ObjectMapper objectMapper = new ObjectMapper();

            return objectMapper.readValue(orderList, new TypeReference<List<ProductDto>>() {
            });
        } catch (IOException e) {
            System.out.print("Error");
            return Collections.emptyList();
        }
    }

    private LocalDateTime getStartOfWeek(Clock clock) {
        LocalDate now = LocalDate.now(clock);
        LocalDate startOfWeek = now.with(DayOfWeek.MONDAY);
        return startOfWeek.atStartOfDay();
    }

    private LocalDateTime getEndOfWeek(Clock clock) {
        LocalDate now = LocalDate.now(clock);
        LocalDate endOfWeek = now.with(DayOfWeek.SUNDAY);
        return endOfWeek.plusDays(1).atStartOfDay().minusNanos(1);
    }

    public Map<String, Double> getSalesSummary() {
        String status = "Paid";
        List<Order> paidOrders = orderRepository.findByStatus(status);

        ZoneId utcPlus8 = ZoneId.of("UTC+8");
        Clock serverClock = Clock.system(utcPlus8);

        double dailySales = calculateSalesForDurationToday(paidOrders, serverClock);
        double weeklySales = calculateSalesForDurationThisMonth(paidOrders, serverClock);
        double monthlySales = calculateSalesForDurationThisWeek(paidOrders, serverClock);

        Map<String, Double> salesSummary = new HashMap<>();
        salesSummary.put("dailySales", dailySales);
        salesSummary.put("weeklySales", weeklySales);
        salesSummary.put("monthlySales", monthlySales);

        return salesSummary;
    }

    private double calculateSalesForDurationToday(List<Order> orders, Clock clock) {
        LocalDate currentServerDate = LocalDate.now(clock);

        return orders.stream()
                .filter(order -> order.getOrderDate().toLocalDate().equals(currentServerDate))
                .mapToDouble(Order::getTotalPrice)
                .sum();
    }

    private double calculateSalesForDurationThisMonth(List<Order> orders, Clock clock) {
        YearMonth currentMonth = YearMonth.now(clock);

        return orders.stream()
                .filter(order -> YearMonth.from(order.getOrderDate()).equals(currentMonth))
                .mapToDouble(Order::getTotalPrice)
                .sum();
    }

    private double calculateSalesForDurationThisWeek(List<Order> orders, Clock clock) {
        LocalDate currentDate = LocalDate.now(clock);
        LocalDate startOfWeek = currentDate.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = startOfWeek.plusDays(6);

        return orders.stream()
                .filter(order -> order.getOrderDate().toLocalDate().isAfter(startOfWeek.minusDays(1)) &&
                        order.getOrderDate().toLocalDate().isBefore(endOfWeek.plusDays(1)))
                .mapToDouble(Order::getTotalPrice)
                .sum();
    }

}
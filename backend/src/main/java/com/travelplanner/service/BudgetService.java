package com.travelplanner.service;

import com.travelplanner.common.exception.ResourceNotFoundException;
import com.travelplanner.common.exception.UnauthorizedException;
import com.travelplanner.domain.model.Trip;
import com.travelplanner.domain.model.TripBudget;
import com.travelplanner.domain.model.TripExpense;
import com.travelplanner.domain.repository.TripBudgetRepository;
import com.travelplanner.domain.repository.TripExpenseRepository;
import com.travelplanner.domain.repository.TripRepository;
import com.travelplanner.dto.budget.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    private final TripBudgetRepository tripBudgetRepository;
    private final TripExpenseRepository tripExpenseRepository;
    private final TripRepository tripRepository;

    public BudgetService(
            TripBudgetRepository tripBudgetRepository,
            TripExpenseRepository tripExpenseRepository,
            TripRepository tripRepository) {
        this.tripBudgetRepository = tripBudgetRepository;
        this.tripExpenseRepository = tripExpenseRepository;
        this.tripRepository = tripRepository;
    }

    @Transactional(readOnly = true)
    public TripBudgetDto getBudget(String tripId, String userId) {
        Trip trip = verifyTripAccess(tripId, userId);
        TripBudget budget = tripBudgetRepository.findByTripId(tripId)
                .orElseGet(() -> {
                    TripBudget b = new TripBudget();
                    b.setTrip(trip);
                    b.setTotalBudget(trip.getBudgetLimit() != null ? trip.getBudgetLimit() : BigDecimal.valueOf(1500.00));
                    b.setCurrency(trip.getCurrency());
                    return tripBudgetRepository.save(b);
                });

        return new TripBudgetDto(
                budget.getId(),
                tripId,
                budget.getTotalBudget(),
                budget.getFlightsAllocated(),
                budget.getHotelsAllocated(),
                budget.getTransportAllocated(),
                budget.getFoodAllocated(),
                budget.getActivitiesAllocated(),
                budget.getEmergencyAllocated(),
                budget.getCurrency()
        );
    }

    @Transactional(readOnly = true)
    public BudgetSummaryDto getBudgetSummary(String tripId, String userId) {
        Trip trip = verifyTripAccess(tripId, userId);
        TripBudget budget = tripBudgetRepository.findByTripId(tripId).orElse(null);
        List<TripExpense> expenses = tripExpenseRepository.findByTripIdOrderByDateDesc(tripId);

        BigDecimal totalBudget = budget != null ? budget.getTotalBudget() :
                (trip.getBudgetLimit() != null ? trip.getBudgetLimit() : BigDecimal.valueOf(1500.00));

        BigDecimal totalSpent = expenses.stream()
                .map(TripExpense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal remaining = totalBudget.subtract(totalSpent);
        int travelers = Math.max(1, trip.getAdultsCount() + trip.getChildrenCount());

        BigDecimal perPersonBudget = totalBudget.divide(BigDecimal.valueOf(travelers), 2, RoundingMode.HALF_UP);
        BigDecimal perPersonActual = totalSpent.divide(BigDecimal.valueOf(travelers), 2, RoundingMode.HALF_UP);

        Map<String, BigDecimal> actualByCategory = new HashMap<>();
        for (TripExpense e : expenses) {
            actualByCategory.merge(e.getCategory().toUpperCase(), e.getAmount(), BigDecimal::add);
        }

        Map<String, BigDecimal> allocatedByCategory = new HashMap<>();
        if (budget != null) {
            allocatedByCategory.put("FLIGHT", budget.getFlightsAllocated());
            allocatedByCategory.put("HOTEL", budget.getHotelsAllocated());
            allocatedByCategory.put("TRANSPORT", budget.getTransportAllocated());
            allocatedByCategory.put("FOOD", budget.getFoodAllocated());
            allocatedByCategory.put("ACTIVITY", budget.getActivitiesAllocated());
            allocatedByCategory.put("EMERGENCY", budget.getEmergencyAllocated());
        }

        boolean isOver = totalSpent.compareTo(totalBudget) > 0;
        BigDecimal percentage = totalBudget.compareTo(BigDecimal.ZERO) > 0 ?
                totalSpent.divide(totalBudget, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).setScale(1, RoundingMode.HALF_UP) :
                BigDecimal.ZERO;

        return new BudgetSummaryDto(
                totalBudget,
                totalSpent,
                remaining,
                perPersonBudget,
                perPersonActual,
                trip.getCurrency(),
                allocatedByCategory,
                actualByCategory,
                isOver,
                percentage
        );
    }

    @Transactional
    public TripExpenseDto addExpense(String tripId, ExpenseCreateRequest request, String userId) {
        Trip trip = verifyTripAccess(tripId, userId);

        TripExpense expense = new TripExpense();
        expense.setTrip(trip);
        expense.setCategory(request.category().toUpperCase());
        expense.setTitle(request.title());
        expense.setAmount(request.amount());
        expense.setCurrency(request.currency() != null ? request.currency() : trip.getCurrency());
        expense.setDate(request.date() != null ? request.date() : LocalDate.now());
        expense.setPaidBy(request.paidBy() != null ? request.paidBy() : trip.getUser().getFirstName());
        expense.setNotes(request.notes());
        expense.setReceiptUrl(request.receiptUrl());

        expense = tripExpenseRepository.save(expense);
        return mapToExpenseDto(expense);
    }

    @Transactional(readOnly = true)
    public List<TripExpenseDto> getExpenses(String tripId, String userId) {
        verifyTripAccess(tripId, userId);
        return tripExpenseRepository.findByTripIdOrderByDateDesc(tripId).stream()
                .map(this::mapToExpenseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteExpense(String expenseId, String userId) {
        TripExpense exp = tripExpenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

        if (!exp.getTrip().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to delete this expense");
        }
        tripExpenseRepository.delete(exp);
    }

    private Trip verifyTripAccess(String tripId, String userId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));
        if (!trip.getUser().getId().equals(userId) && !trip.isPublic()) {
            throw new UnauthorizedException("You do not have permission to access this trip");
        }
        return trip;
    }

    private TripExpenseDto mapToExpenseDto(TripExpense e) {
        return new TripExpenseDto(
                e.getId(),
                e.getTrip().getId(),
                e.getCategory(),
                e.getTitle(),
                e.getAmount(),
                e.getCurrency(),
                e.getDate(),
                e.getPaidBy(),
                e.getNotes(),
                e.getReceiptUrl()
        );
    }
}

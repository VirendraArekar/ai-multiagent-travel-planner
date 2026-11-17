package com.travelplanner;

import com.travelplanner.domain.model.Trip;
import com.travelplanner.domain.model.TripBudget;
import com.travelplanner.domain.model.TripExpense;
import com.travelplanner.domain.model.User;
import com.travelplanner.domain.repository.TripBudgetRepository;
import com.travelplanner.domain.repository.TripExpenseRepository;
import com.travelplanner.domain.repository.TripRepository;
import com.travelplanner.dto.budget.BudgetSummaryDto;
import com.travelplanner.dto.budget.ExpenseCreateRequest;
import com.travelplanner.dto.budget.TripExpenseDto;
import com.travelplanner.service.BudgetService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BudgetServiceTest {

    @Mock private TripBudgetRepository tripBudgetRepository;
    @Mock private TripExpenseRepository tripExpenseRepository;
    @Mock private TripRepository tripRepository;

    private BudgetService budgetService;

    @BeforeEach
    void setUp() {
        budgetService = new BudgetService(tripBudgetRepository, tripExpenseRepository, tripRepository);
    }

    @Test
    void getBudgetSummary_CalculatesTotalsAndPercentages() {
        User user = new User();
        user.setId("u-1");

        Trip trip = new Trip();
        trip.setId("trip-1");
        trip.setUser(user);
        trip.setAdultsCount(2);
        trip.setChildrenCount(0);
        trip.setCurrency("USD");
        when(tripRepository.findById("trip-1")).thenReturn(Optional.of(trip));

        TripBudget budget = new TripBudget();
        budget.setTotalBudget(BigDecimal.valueOf(1000.00));
        when(tripBudgetRepository.findByTripId("trip-1")).thenReturn(Optional.of(budget));

        TripExpense exp1 = new TripExpense();
        exp1.setCategory("FOOD");
        exp1.setAmount(BigDecimal.valueOf(150.00));

        TripExpense exp2 = new TripExpense();
        exp2.setCategory("TRANSPORT");
        exp2.setAmount(BigDecimal.valueOf(50.00));

        when(tripExpenseRepository.findByTripIdOrderByDateDesc("trip-1")).thenReturn(List.of(exp1, exp2));

        BudgetSummaryDto summary = budgetService.getBudgetSummary("trip-1", "u-1");

        assertNotNull(summary);
        assertEquals(BigDecimal.valueOf(1000.00), summary.totalBudget());
        assertEquals(BigDecimal.valueOf(200.00), summary.totalActualSpent());
        assertEquals(BigDecimal.valueOf(800.00), summary.remainingBudget());
        assertFalse(summary.isOverBudget());
        assertEquals(BigDecimal.valueOf(20.0), summary.percentageUsed());
    }

    @Test
    void addExpense_Success() {
        User user = new User();
        user.setId("u-1");
        user.setFirstName("Alice");

        Trip trip = new Trip();
        trip.setId("trip-1");
        trip.setUser(user);
        trip.setCurrency("EUR");
        when(tripRepository.findById("trip-1")).thenReturn(Optional.of(trip));

        when(tripExpenseRepository.save(any(TripExpense.class))).thenAnswer(i -> {
            TripExpense e = i.getArgument(0);
            e.setId("exp-new-id");
            return e;
        });

        ExpenseCreateRequest req = new ExpenseCreateRequest(
                "DINING", "Rooftop Dinner", BigDecimal.valueOf(85.50),
                "EUR", LocalDate.now(), "Alice", "Great tapas", null
        );

        TripExpenseDto dto = budgetService.addExpense("trip-1", req, "u-1");

        assertNotNull(dto);
        assertEquals("exp-new-id", dto.id());
        assertEquals(BigDecimal.valueOf(85.50), dto.amount());
        verify(tripExpenseRepository).save(any(TripExpense.class));
    }
}

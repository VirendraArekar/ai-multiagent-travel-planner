package com.travelplanner.controller;

import com.travelplanner.common.dto.ApiResponse;
import com.travelplanner.common.security.UserPrincipal;
import com.travelplanner.dto.budget.*;
import com.travelplanner.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trips/{tripId}/budget")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<TripBudgetDto>> getBudget(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String tripId) {
        TripBudgetDto dto = budgetService.getBudget(tripId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<BudgetSummaryDto>> getBudgetSummary(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String tripId) {
        BudgetSummaryDto dto = budgetService.getBudgetSummary(tripId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/expenses")
    public ResponseEntity<ApiResponse<List<TripExpenseDto>>> getExpenses(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String tripId) {
        List<TripExpenseDto> list = budgetService.getExpenses(tripId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/expenses")
    public ResponseEntity<ApiResponse<TripExpenseDto>> addExpense(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String tripId,
            @Valid @RequestBody ExpenseCreateRequest request) {
        TripExpenseDto dto = budgetService.addExpense(tripId, request, principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Expense recorded", dto));
    }

    @DeleteMapping("/expenses/{expenseId}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String tripId,
            @PathVariable String expenseId) {
        budgetService.deleteExpense(expenseId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Expense deleted", null));
    }
}

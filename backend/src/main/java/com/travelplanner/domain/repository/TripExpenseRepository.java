package com.travelplanner.domain.repository;

import com.travelplanner.domain.model.TripExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripExpenseRepository extends JpaRepository<TripExpense, String> {
    List<TripExpense> findByTripIdOrderByDateDesc(String tripId);
}

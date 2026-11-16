package com.travelplanner.domain.repository;

import com.travelplanner.domain.model.AgentTask;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgentTaskRepository extends JpaRepository<AgentTask, String> {
    List<AgentTask> findByTripIdOrderByExecutionOrderAsc(String tripId);
    Page<AgentTask> findAllByOrderByCreatedAtDesc(Pageable pageable);
    List<AgentTask> findByStatus(String status);

    @Query("SELECT COUNT(t) FROM AgentTask t WHERE t.status = 'COMPLETED'")
    long countCompletedTasks();

    @Query("SELECT COUNT(t) FROM AgentTask t WHERE t.status = 'FAILED'")
    long countFailedTasks();

    @Query("SELECT COUNT(t) FROM AgentTask t WHERE t.status = 'RUNNING'")
    long countRunningTasks();

    @Query("SELECT COALESCE(SUM(t.tokensUsed), 0) FROM AgentTask t")
    long sumTokensUsed();
}

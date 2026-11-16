package com.travelplanner.domain.repository;

import com.travelplanner.domain.model.AgentExecutionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgentExecutionLogRepository extends JpaRepository<AgentExecutionLog, String> {
    List<AgentExecutionLog> findByAgentTaskIdOrderByTimestampAsc(String agentTaskId);
}

package com.travelplanner.domain.repository;

import com.travelplanner.domain.model.AgentToolCall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgentToolCallRepository extends JpaRepository<AgentToolCall, String> {
    List<AgentToolCall> findByAgentTaskIdOrderByCreatedAtAsc(String agentTaskId);
}

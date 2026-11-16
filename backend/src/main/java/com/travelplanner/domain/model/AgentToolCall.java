package com.travelplanner.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "agent_tool_calls")
public class AgentToolCall {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_task_id", nullable = false)
    @JsonIgnore
    private AgentTask agentTask;

    @Column(name = "tool_name", nullable = false, length = 100)
    private String toolName;

    @Column(columnDefinition = "TEXT")
    private String arguments;

    @Column(columnDefinition = "TEXT")
    private String result;

    @Column(name = "duration_ms")
    private Long durationMs = 0L;

    @Column(length = 50)
    private String status = "SUCCESS"; // SUCCESS, ERROR

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @PrePersist
    public void prePersist() {
        if (this.id == null) this.id = UUID.randomUUID().toString();
        if (this.createdAt == null) this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public AgentTask getAgentTask() { return agentTask; }
    public void setAgentTask(AgentTask agentTask) { this.agentTask = agentTask; }
    public String getToolName() { return toolName; }
    public void setToolName(String toolName) { this.toolName = toolName; }
    public String getArguments() { return arguments; }
    public void setArguments(String arguments) { this.arguments = arguments; }
    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }
    public Long getDurationMs() { return durationMs; }
    public void setDurationMs(Long durationMs) { this.durationMs = durationMs; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

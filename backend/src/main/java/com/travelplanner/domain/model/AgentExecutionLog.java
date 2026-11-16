package com.travelplanner.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "agent_execution_logs")
public class AgentExecutionLog {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_task_id", nullable = false)
    @JsonIgnore
    private AgentTask agentTask;

    @Column(name = "log_level", length = 20)
    private String logLevel = "INFO"; // DEBUG, INFO, WARN, ERROR

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    private Instant timestamp = Instant.now();

    @PrePersist
    public void prePersist() {
        if (this.id == null) this.id = UUID.randomUUID().toString();
        if (this.timestamp == null) this.timestamp = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public AgentTask getAgentTask() { return agentTask; }
    public void setAgentTask(AgentTask agentTask) { this.agentTask = agentTask; }
    public String getLogLevel() { return logLevel; }
    public void setLogLevel(String logLevel) { this.logLevel = logLevel; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}

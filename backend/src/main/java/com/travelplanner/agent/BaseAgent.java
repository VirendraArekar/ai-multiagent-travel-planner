package com.travelplanner.agent;

import com.travelplanner.agent.llm.LlmClient;
import com.travelplanner.domain.model.Agent;
import com.travelplanner.domain.model.AgentExecutionLog;
import com.travelplanner.domain.model.AgentTask;
import com.travelplanner.domain.model.AgentToolCall;
import com.travelplanner.domain.repository.AgentExecutionLogRepository;
import com.travelplanner.domain.repository.AgentRepository;
import com.travelplanner.domain.repository.AgentTaskRepository;
import com.travelplanner.domain.repository.AgentToolCallRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;

public abstract class BaseAgent {

    protected final Logger log = LoggerFactory.getLogger(getClass());

    protected final AgentRepository agentRepository;
    protected final AgentTaskRepository agentTaskRepository;
    protected final AgentExecutionLogRepository agentLogRepository;
    protected final AgentToolCallRepository agentToolCallRepository;
    protected final LlmClient llmClient;

    public BaseAgent(
            AgentRepository agentRepository,
            AgentTaskRepository agentTaskRepository,
            AgentExecutionLogRepository agentLogRepository,
            AgentToolCallRepository agentToolCallRepository,
            LlmClient llmClient) {
        this.agentRepository = agentRepository;
        this.agentTaskRepository = agentTaskRepository;
        this.agentLogRepository = agentLogRepository;
        this.agentToolCallRepository = agentToolCallRepository;
        this.llmClient = llmClient;
    }

    public abstract String getAgentName();
    public abstract String getAgentRole();
    public abstract int getExecutionOrder();

    @Transactional
    public AgentTask execute(AgentExecutionContext context) {
        Agent agent = agentRepository.findByName(getAgentName())
                .orElseGet(() -> {
                    Agent newAgent = new Agent();
                    newAgent.setName(getAgentName());
                    newAgent.setRole(getAgentRole());
                    newAgent.setDescription("Specialized travel agent: " + getAgentName());
                    return agentRepository.save(newAgent);
                });

        AgentTask task = new AgentTask();
        task.setTripId(context.getTripId());
        task.setAgent(agent);
        task.setAgentName(getAgentName());
        task.setTaskName(getAgentName() + " Execution");
        task.setStatus("RUNNING");
        task.setExecutionOrder(getExecutionOrder());
        task = agentTaskRepository.save(task);

        logInfo(task, "Agent task initialized. Beginning execution.");
        long startTime = System.currentTimeMillis();

        try {
            executeTask(context, task);

            long duration = System.currentTimeMillis() - startTime;
            task.setDurationMs(duration);
            task.setStatus("COMPLETED");
            logInfo(task, "Agent task completed successfully in " + duration + "ms.");
        } catch (Exception ex) {
            long duration = System.currentTimeMillis() - startTime;
            task.setDurationMs(duration);
            task.setStatus("FAILED");
            task.setErrorMessage(ex.getMessage());
            logError(task, "Agent task failed: " + ex.getMessage());
            log.error("Error in agent {}", getAgentName(), ex);
        }

        task = agentTaskRepository.save(task);
        context.recordMetrics(task.getDurationMs(), task.getTokensUsed(), task.getCostUsd());
        return task;
    }

    protected abstract void executeTask(AgentExecutionContext context, AgentTask task) throws Exception;

    protected void logInfo(AgentTask task, String message) {
        AgentExecutionLog logEntry = new AgentExecutionLog();
        logEntry.setAgentTask(task);
        logEntry.setLogLevel("INFO");
        logEntry.setMessage(message);
        agentLogRepository.save(logEntry);
    }

    protected void logError(AgentTask task, String message) {
        AgentExecutionLog logEntry = new AgentExecutionLog();
        logEntry.setAgentTask(task);
        logEntry.setLogLevel("ERROR");
        logEntry.setMessage(message);
        agentLogRepository.save(logEntry);
    }

    protected void recordToolCall(AgentTask task, String toolName, String args, String result, long durationMs, boolean success) {
        AgentToolCall toolCall = new AgentToolCall();
        toolCall.setAgentTask(task);
        toolCall.setToolName(toolName);
        toolCall.setArguments(args);
        toolCall.setResult(result);
        toolCall.setDurationMs(durationMs);
        toolCall.setStatus(success ? "SUCCESS" : "ERROR");
        agentToolCallRepository.save(toolCall);
    }
}

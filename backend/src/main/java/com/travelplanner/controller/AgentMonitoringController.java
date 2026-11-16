package com.travelplanner.controller;

import com.travelplanner.agent.OrchestratorAgent;
import com.travelplanner.common.dto.ApiResponse;
import com.travelplanner.common.security.UserPrincipal;
import com.travelplanner.dto.agent.AgentDto;
import com.travelplanner.dto.agent.AgentExecutionTraceDto;
import com.travelplanner.dto.agent.AgentMonitoringStatsDto;
import com.travelplanner.dto.agent.TriggerAgentWorkflowRequest;
import com.travelplanner.service.AgentMonitoringService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/agents")
public class AgentMonitoringController {

    private final AgentMonitoringService monitoringService;
    private final OrchestratorAgent orchestratorAgent;

    public AgentMonitoringController(AgentMonitoringService monitoringService, OrchestratorAgent orchestratorAgent) {
        this.monitoringService = monitoringService;
        this.orchestratorAgent = orchestratorAgent;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AgentDto>>> getAllAgents() {
        List<AgentDto> agents = monitoringService.getAllAgents();
        return ResponseEntity.ok(ApiResponse.ok(agents));
    }

    @GetMapping("/trips/{tripId}/trace")
    public ResponseEntity<ApiResponse<AgentExecutionTraceDto>> getTripExecutionTrace(
            @PathVariable String tripId) {
        AgentExecutionTraceDto trace = monitoringService.getTripExecutionTrace(tripId);
        return ResponseEntity.ok(ApiResponse.ok(trace));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AgentMonitoringStatsDto>> getMonitoringStats() {
        AgentMonitoringStatsDto stats = monitoringService.getMonitoringStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @PostMapping("/tasks/{taskId}/retry")
    public ResponseEntity<ApiResponse<Void>> retryTask(
            @PathVariable String taskId) {
        monitoringService.retryTask(taskId);
        return ResponseEntity.ok(ApiResponse.ok("Task retry initiated", null));
    }

    @PostMapping("/workflow/trigger")
    public ResponseEntity<ApiResponse<Void>> triggerWorkflow(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody TriggerAgentWorkflowRequest request) {
        orchestratorAgent.planTrip(request.tripId(), null);
        return ResponseEntity.ok(ApiResponse.ok("Multi-agent workflow triggered successfully", null));
    }
}

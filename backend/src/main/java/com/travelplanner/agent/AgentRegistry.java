package com.travelplanner.agent;

import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class AgentRegistry {

    private final Map<String, BaseAgent> agents = new ConcurrentHashMap<>();

    public AgentRegistry(List<BaseAgent> agentList) {
        for (BaseAgent agent : agentList) {
            agents.put(agent.getAgentName(), agent);
        }
    }

    public BaseAgent getAgent(String name) {
        return agents.get(name);
    }

    public Collection<BaseAgent> getAllAgents() {
        return agents.values();
    }

    public List<BaseAgent> getOrderedAgents() {
        List<BaseAgent> list = new ArrayList<>(agents.values());
        list.sort(Comparator.comparingInt(BaseAgent::getExecutionOrder));
        return list;
    }
}

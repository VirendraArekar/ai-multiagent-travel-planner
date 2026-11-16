package com.travelplanner.domain.repository;

import com.travelplanner.domain.model.Agent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AgentRepository extends JpaRepository<Agent, String> {
    Optional<Agent> findByName(String name);
}

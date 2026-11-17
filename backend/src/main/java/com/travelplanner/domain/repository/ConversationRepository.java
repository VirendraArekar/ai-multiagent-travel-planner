package com.travelplanner.domain.repository;

import com.travelplanner.domain.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, String> {
    List<Conversation> findByUserIdOrderByUpdatedAtDesc(String userId);
    Optional<Conversation> findByUserIdAndTripId(String userId, String tripId);
}

package com.travelplanner.service;

import com.travelplanner.common.exception.ResourceNotFoundException;
import com.travelplanner.domain.model.Destination;
import com.travelplanner.domain.model.FavoriteDestination;
import com.travelplanner.domain.model.User;
import com.travelplanner.domain.repository.DestinationRepository;
import com.travelplanner.domain.repository.FavoriteDestinationRepository;
import com.travelplanner.domain.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DestinationService {

    private final DestinationRepository destinationRepository;
    private final FavoriteDestinationRepository favoriteRepository;
    private final UserRepository userRepository;

    public DestinationService(
            DestinationRepository destinationRepository,
            FavoriteDestinationRepository favoriteRepository,
            UserRepository userRepository) {
        this.destinationRepository = destinationRepository;
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Page<Destination> getAllDestinations(Pageable pageable) {
        return destinationRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public List<Destination> getFeaturedDestinations() {
        return destinationRepository.findByFeaturedTrue();
    }

    @Transactional(readOnly = true)
    public List<Destination> getPopularDestinations() {
        return destinationRepository.findByPopularTrue();
    }

    @Transactional(readOnly = true)
    public Destination getDestinationById(String id) {
        return destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Page<Destination> searchDestinations(String query, Pageable pageable) {
        return destinationRepository.searchDestinations(query, pageable);
    }

    @Transactional
    public void saveFavorite(String userId, String destinationId) {
        if (!favoriteRepository.existsByUserIdAndDestinationId(userId, destinationId)) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            Destination dest = destinationRepository.findById(destinationId)
                    .orElseThrow(() -> new ResourceNotFoundException("Destination not found"));

            FavoriteDestination fav = new FavoriteDestination();
            fav.setUser(user);
            fav.setDestination(dest);
            favoriteRepository.save(fav);
        }
    }

    @Transactional(readOnly = true)
    public List<FavoriteDestination> getUserFavorites(String userId) {
        return favoriteRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public void removeFavorite(String userId, String destinationId) {
        favoriteRepository.findByUserIdAndDestinationId(userId, destinationId)
                .ifPresent(favoriteRepository::delete);
    }
}

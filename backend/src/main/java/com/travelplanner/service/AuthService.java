package com.travelplanner.service;

import com.travelplanner.common.exception.BadRequestException;
import com.travelplanner.common.exception.ResourceNotFoundException;
import com.travelplanner.common.security.JwtTokenProvider;
import com.travelplanner.common.security.UserPrincipal;
import com.travelplanner.domain.model.User;
import com.travelplanner.domain.model.UserProfile;
import com.travelplanner.domain.model.UserPreference;
import com.travelplanner.domain.repository.UserRepository;
import com.travelplanner.dto.auth.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailAndDeletedFalse(request.email())) {
            throw new BadRequestException("An account with this email already exists: " + request.email());
        }

        User user = new User();
        user.setEmail(request.email().toLowerCase().trim());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPhoneNumber(request.phoneNumber());
        user.setRole("ROLE_USER");
        user.setActive(true);
        user.setEmailVerified(true); // Auto-verify for frictionless onboarding

        UserProfile profile = new UserProfile();
        profile.setUser(user);
        user.setProfile(profile);

        UserPreference preference = new UserPreference();
        preference.setUser(user);
        user.setPreference(preference);

        user = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail(), user.getId());

        return AuthResponse.of(accessToken, refreshToken, user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().toLowerCase().trim(), request.password())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        User user = userRepository.findByEmailAndDeletedFalse(principal.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail(), user.getId());

        return AuthResponse.of(accessToken, refreshToken, user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole());
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        if (!tokenProvider.validateToken(request.refreshToken())) {
            throw new BadRequestException("Invalid or expired refresh token");
        }

        String email = tokenProvider.getUsernameFromJwt(request.refreshToken());
        User user = userRepository.findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserPrincipal principal = UserPrincipal.create(user);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        String newAccessToken = tokenProvider.generateAccessToken(auth);
        String newRefreshToken = tokenProvider.generateRefreshToken(user.getEmail(), user.getId());

        return AuthResponse.of(newAccessToken, newRefreshToken, user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole());
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmailAndDeletedFalse(request.email()).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            user.setResetPasswordToken(token);
            user.setResetPasswordExpiresAt(Instant.now().plusSeconds(3600)); // 1 hour
            userRepository.save(user);
        });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetPasswordToken(request.token())
                .orElseThrow(() -> new BadRequestException("Invalid or expired password reset token"));

        if (user.getResetPasswordExpiresAt() != null && user.getResetPasswordExpiresAt().isBefore(Instant.now())) {
            throw new BadRequestException("Password reset token has expired");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpiresAt(null);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public UserProfileDto getCurrentUserProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserProfile p = user.getProfile();
        UserPreference pref = user.getPreference();

        return new UserProfileDto(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getRole(),
                user.getAvatarUrl(),
                p != null ? p.getBio() : null,
                p != null ? p.getDateOfBirth() : null,
                p != null ? p.getNationality() : null,
                p != null ? p.getPreferredLanguage() : "en",
                p != null ? p.getHomeAirport() : null,
                p != null ? p.getDietaryPreferences() : null,
                pref != null ? pref.getPreferredCurrency() : "USD",
                pref != null ? pref.getTravelPace() : "MODERATE",
                pref != null ? pref.getAccommodationStyle() : "BOUTIQUE",
                pref != null ? pref.getInterests() : null,
                pref != null && pref.isEmailNotificationsEnabled(),
                pref != null && pref.isSmsNotificationsEnabled()
        );
    }
}

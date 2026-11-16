package com.travelplanner;

import com.travelplanner.common.exception.BadRequestException;
import com.travelplanner.common.security.JwtTokenProvider;
import com.travelplanner.common.security.UserPrincipal;
import com.travelplanner.domain.model.User;
import com.travelplanner.domain.repository.UserRepository;
import com.travelplanner.dto.auth.AuthResponse;
import com.travelplanner.dto.auth.LoginRequest;
import com.travelplanner.dto.auth.RegisterRequest;
import com.travelplanner.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtTokenProvider tokenProvider;
    @Mock private Authentication authentication;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, passwordEncoder, authenticationManager, tokenProvider);
    }

    @Test
    void register_Success() {
        RegisterRequest req = new RegisterRequest("jane@test.com", "Password123!", "Jane", "Doe", null);
        when(userRepository.existsByEmailAndDeletedFalse("jane@test.com")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hashed_pass");

        User savedUser = new User();
        savedUser.setId("u-jane");
        savedUser.setEmail("jane@test.com");
        savedUser.setFirstName("Jane");
        savedUser.setLastName("Doe");
        savedUser.setRole("ROLE_USER");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(tokenProvider.generateAccessToken(authentication)).thenReturn("jwt.access.token");
        when(tokenProvider.generateRefreshToken(any(), any())).thenReturn("jwt.refresh.token");

        AuthResponse resp = authService.register(req);

        assertNotNull(resp);
        assertEquals("jane@test.com", resp.email());
        assertEquals("jwt.access.token", resp.accessToken());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_EmailAlreadyExists_ThrowsException() {
        RegisterRequest req = new RegisterRequest("existing@test.com", "Password123!", "Exist", "User", null);
        when(userRepository.existsByEmailAndDeletedFalse("existing@test.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(req));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        LoginRequest req = new LoginRequest("user@test.com", "Password123!");
        User user = new User();
        user.setId("u-1");
        user.setEmail("user@test.com");
        user.setFirstName("First");
        user.setLastName("Last");
        user.setRole("ROLE_USER");

        UserPrincipal principal = UserPrincipal.create(user);
        when(authentication.getPrincipal()).thenReturn(principal);
        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(userRepository.findByEmailAndDeletedFalse("user@test.com")).thenReturn(Optional.of(user));
        when(tokenProvider.generateAccessToken(authentication)).thenReturn("jwt.access.token");
        when(tokenProvider.generateRefreshToken(any(), any())).thenReturn("jwt.refresh.token");

        AuthResponse resp = authService.login(req);

        assertNotNull(resp);
        assertEquals("user@test.com", resp.email());
        assertEquals("jwt.access.token", resp.accessToken());
    }
}

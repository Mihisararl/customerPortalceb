package com.ceb.portal.service;

import com.ceb.portal.dto.LoginRequest;
import com.ceb.portal.dto.LoginResponse;
import com.ceb.portal.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

/**
 * Authentication Service - handles user login and token generation
 */
@Service
public class AuthenticationService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    /**
     * Authenticate user and return JWT token
     */
    public LoginResponse login(LoginRequest loginRequest) throws AuthenticationException {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        String token = tokenProvider.generateToken(authentication);

        return LoginResponse.builder()
                .token(token)
                .username(authentication.getName())
                .expiresIn(tokenProvider.getExpirationTime())
                .build();
    }
}

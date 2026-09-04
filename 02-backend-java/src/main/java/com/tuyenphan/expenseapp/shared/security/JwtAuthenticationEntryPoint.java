package com.tuyenphan.expenseapp.shared.security;

import tools.jackson.databind.ObjectMapper;
import com.tuyenphan.expenseapp.shared.common.ApiError;
import com.tuyenphan.expenseapp.shared.common.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Ensures an unauthenticated request gets the same ApiResponse envelope as every
 * other error (docs/API_SPEC.md §4) instead of Spring Security's default plain-text 401.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                          AuthenticationException authException) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        ApiResponse<Void> body = ApiResponse.error(new ApiError("AUTH_1003", "Invalid or missing token"));
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}

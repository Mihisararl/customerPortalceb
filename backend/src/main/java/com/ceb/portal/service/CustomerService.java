package com.ceb.portal.service;

import com.ceb.portal.dto.CustomerDetailsDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * Customer Service - handles customer data retrieval from external CEB API
 */
@Service
public class CustomerService {

    private static final Logger logger = LoggerFactory.getLogger(CustomerService.class);

    @Value("${external.api.base-url}")
    private String apiBaseUrl;

    @Value("${external.api.username}")
    private String apiUsername;

    @Value("${external.api.password}")
    private String apiPassword;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    /**
     * Validate account number format
     */
    public boolean isValidAccountNumberFormat(String accountNumber) {
        if (accountNumber == null) {
            return false;
        }
        String trimmed = accountNumber.toString().trim();
        return trimmed.length() == 10 && trimmed.matches("\\d{10}");
    }

    /**
     * Validate and retrieve customer details by account number
     */
    public CustomerDetailsDto validateAccountNumber(String accountNumber) throws Exception {
        if (!isValidAccountNumberFormat(accountNumber)) {
            throw new Exception("Account number must be exactly 10 digits");
        }

        try {
            // Get authentication token from external API
            String token = getExternalApiToken();

            // Fetch customer details
            String url = apiBaseUrl + "/api/customer/CEBCustomer_CurrantBalance";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .POST(HttpRequest.BodyPublishers.ofString("{\"accountnumber\":\"" + accountNumber + "\"}"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + token)
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (!isSuccessful(response.statusCode())) {
                handleApiError(response.statusCode());
            }

            // Parse and return customer details
            return parseCustomerResponse(response.body());

        } catch (Exception e) {
            logger.error("Error validating account number: {}", accountNumber, e);
            throw new Exception("Failed to retrieve customer details: " + e.getMessage());
        }
    }

    /**
     * Get mobile number for account
     */
    public String getMobileNumberByAccount(String accountNumber) throws Exception {
        if (!isValidAccountNumberFormat(accountNumber)) {
            throw new Exception("Account number must be exactly 10 digits");
        }

        try {
            String url = apiBaseUrl + "/customer-details-api/api/Customerdetails/by-account?accountNumber=" +
                    URLEncoder.encode(accountNumber, StandardCharsets.UTF_8);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .header("Content-Type", "application/json")
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (!isSuccessful(response.statusCode())) {
                if (response.statusCode() == 404) {
                    throw new Exception("No registered mobile number found for this account");
                }
                throw new Exception("Failed to fetch registered mobile number");
            }

            // Extract mobile number from response
            return extractMobileFromResponse(response.body());

        } catch (Exception e) {
            logger.error("Error fetching mobile number for account: {}", accountNumber, e);
            throw new Exception("Failed to fetch mobile number: " + e.getMessage());
        }
    }

    /**
     * Get auth token from external API
     */
    private String getExternalApiToken() throws Exception {
        try {
            String url = apiBaseUrl + "/api/Auth/login";

            String requestBody = "{\"username\":\"" + apiUsername + "\",\"password\":\"" + apiPassword + "\"}";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .header("Content-Type", "application/json")
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (!isSuccessful(response.statusCode())) {
                throw new Exception("Authentication failed with external API");
            }

            // Parse token from response
            return parseTokenFromResponse(response.body());

        } catch (Exception e) {
            logger.error("Error getting auth token from external API", e);
            throw new Exception("Failed to authenticate with external API");
        }
    }

    /**
     * Parse customer response from external API
     */
    private CustomerDetailsDto parseCustomerResponse(String responseBody) throws Exception {
        // This is a simplified parser - adjust based on actual API response format
        // In production, use JSON parsing library like Jackson

        if (responseBody == null || responseBody.isEmpty()) {
            throw new Exception("Empty response from API");
        }

        logger.debug("API Response: {}", responseBody);

        // Basic implementation - should be improved with proper JSON parsing
        CustomerDetailsDto customer = new CustomerDetailsDto();
        customer.setStatus("active");

        return customer;
    }

    /**
     * Extract token from auth response
     */
    private String parseTokenFromResponse(String responseBody) throws Exception {
        // Simplified token extraction - use proper JSON parsing in production
        if (responseBody == null || responseBody.isEmpty()) {
            throw new Exception("Empty auth response");
        }
        // This is a placeholder - implement proper JSON parsing
        return "token_placeholder";
    }

    /**
     * Extract mobile number from lookup response
     */
    private String extractMobileFromResponse(String responseBody) throws Exception {
        // Simplified mobile extraction - use proper JSON parsing in production
        if (responseBody == null || responseBody.isEmpty()) {
            throw new Exception("Empty response");
        }
        // This is a placeholder - implement proper JSON parsing
        return "";
    }

    /**
     * Check if response status is successful
     */
    private boolean isSuccessful(int statusCode) {
        return statusCode >= 200 && statusCode < 300;
    }

    /**
     * Handle API errors based on status code
     */
    private void handleApiError(int statusCode) throws Exception {
        switch (statusCode) {
            case 401:
                throw new Exception("Authentication failed");
            case 404:
                throw new Exception("Resource not found");
            case 400:
                throw new Exception("Invalid request");
            case 500:
            case 503:
                throw new Exception("Service unavailable");
            default:
                throw new Exception("API error: " + statusCode);
        }
    }
}

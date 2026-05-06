package com.edl.portal.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import com.edl.portal.exception.ExternalApiException;
import com.edl.portal.exception.InvalidAccountNumberException;
import com.edl.portal.exception.MobileNumberNotAvailableException;
import com.edl.portal.model.CustomerData;
import com.edl.portal.model.Payment;
import com.edl.portal.util.ValidationUtil;
import com.edl.portal.util.MobileNumberUtil;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Slf4j
@Service
public class CustomerService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ValidationUtil validationUtil;

    @Autowired
    private MobileNumberUtil mobileNumberUtil;

    @Value("${external.api.customer.balance.url}")
    private String customerBalanceUrl;

    @Value("${external.api.customer.details.url}")
    private String customerDetailsUrl;

    @Value("${external.api.credentials.username}")
    private String apiUsername;

    @Value("${external.api.credentials.password}")
    private String apiPassword;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public CustomerData validateAccountNumber(String accountNumber) {
        // Validate input
        if (!validationUtil.isValidAccountNumber(accountNumber)) {
            throw new InvalidAccountNumberException("Account number must be exactly 10 digits");
        }

        accountNumber = accountNumber.trim();

        try {
            // Get authentication token
            String token = getAuthToken();

            // Create headers with Bearer token
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(token);

            // Prepare request body
            String requestBody = String.format("{\"accountnumber\": \"%s\"}", accountNumber);
            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            // Make API call
            String endpoint = customerBalanceUrl + "/api/customer/CEBCustomer_CurrantBalance";
            ResponseEntity<String> response = restTemplate.postForEntity(endpoint, request, String.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new ExternalApiException("Failed to validate account number", response.getStatusCode().value());
            }

            // Parse response
            JsonNode responseData = objectMapper.readTree(response.getBody());

            if (!responseData.get("isSuccess").asBoolean()) {
                throw new InvalidAccountNumberException("Account number not found or invalid");
            }

            // Extract customer data
            JsonNode customerNode = responseData.get("cebCustomerData");
            
            // Get mobile number when available, but do not fail account validation if missing
            String mobileNo = "";
            try {
                mobileNo = getMobileNumberByAccount(accountNumber);
            } catch (MobileNumberNotAvailableException e) {
                log.warn("No registered mobile number found for account: {}", accountNumber);
            }

            // Build customer data object
                CustomerData customerData = CustomerData.builder()
                    .accountNumber(getFirstTextValue(customerNode, "accountnumber", "accountNumber", "accNo"))
                    .customerName(getFirstTextValue(customerNode, "name", "customerName", "customer_name"))
                    .address(getFirstTextValue(customerNode, "address", "serviceAddress", "service_address"))
                    .tariff(getFirstTextValue(customerNode, "tariff", "tariffType"))
                    .customerType(getFirstTextValue(customerNode, "customerType", "customer_type"))
                    .billingMonth(getFirstTextValue(customerNode, "billingMonth", "billing_month"))
                    .currentBalance(getFirstDoubleValue(customerNode, "currentBalanceLKR", "currentBalance", "balance"))
                    .units(getFirstDoubleValue(customerNode, "units"))
                    .previousReading(getFirstDoubleValue(customerNode, "previousReading"))
                    .currentReading(getFirstDoubleValue(customerNode, "currentReading"))
                    .status("active")
                    .mobileNo(mobileNo)
                    .phone(mobileNo)
                    .build();

            // Extract recent payments
            JsonNode paymentsNode = customerNode.get("after_Payments");
            if (paymentsNode != null && paymentsNode.isArray()) {
                List<Payment> payments = new ArrayList<>();
                for (JsonNode paymentNode : paymentsNode) {
                    payments.add(Payment.builder()
                            .paidAmount(paymentNode.path("paidAmount").asDouble(0))
                            .paidDate(paymentNode.path("paidDate").asText(""))
                            .build());
                }
                customerData.setRecentPayments(payments);

                if (!payments.isEmpty()) {
                    Payment lastPayment = payments.get(0);
                    customerData.setLastPaymentAmount(lastPayment.getPaidAmount());
                    customerData.setLastPaymentDate(lastPayment.getPaidDate());
                }
            }

            return customerData;

        } catch (ExternalApiException | InvalidAccountNumberException | MobileNumberNotAvailableException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error validating account number: {}", accountNumber, e);
            throw new ExternalApiException("Service temporarily unavailable. Please try again later.", 503);
        }
    }

    public String getMobileNumberByAccount(String accountNumber) {
        // Validate input
        if (!validationUtil.isValidAccountNumber(accountNumber)) {
            throw new InvalidAccountNumberException("Account number must be exactly 10 digits");
        }

        accountNumber = accountNumber.trim();

        try {
            // Create request with proper headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.add("Accept", MediaType.APPLICATION_JSON_VALUE);

            HttpEntity<String> request = new HttpEntity<>(headers);

            // Make API call
            String endpoint = customerDetailsUrl + "/api/Customerdetails/by-account?accountNumber=" + accountNumber;
            ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.GET, request, String.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                if (response.getStatusCode() == HttpStatus.NOT_FOUND) {
                    throw new MobileNumberNotAvailableException("No registered mobile number found for this account.");
                }
                throw new ExternalApiException("Failed to fetch mobile number", response.getStatusCode().value());
            }

            // Parse response and extract mobile number
            JsonNode responseData = objectMapper.readTree(response.getBody());
            String mobileNo = extractMobileNumber(responseData);

            if (mobileNo == null || mobileNo.isEmpty()) {
                throw new MobileNumberNotAvailableException("Registered mobile number is not available for this account.");
            }

            return mobileNo;

        } catch (MobileNumberNotAvailableException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error fetching mobile number for account: {}", accountNumber, e);
            throw new MobileNumberNotAvailableException("Unable to fetch registered mobile number. Please try again.");
        }
    }

    private String extractMobileNumber(JsonNode data) {
        if (data == null) {
            return "";
        }

        String mobileFromTelephoneNos = extractFromTelephoneNos(data);
        if (!mobileFromTelephoneNos.isEmpty()) {
            return mobileNumberUtil.normalizeMobileNumber(mobileFromTelephoneNos);
        }

        // Try multiple possible field names
        String[] candidates = {
                getTextValue(data, "mobileNo"),
                getTextValue(data, "mobileNumber"),
                getTextValue(data, "phone"),
                getTextValue(data, "telephone"),
                getTextValue(data, "contactNo"),
                getTextValue(data, "telephoneNo")
        };

        // Check nested structures
        if (data.has("data") && data.get("data").isArray() && data.get("data").size() > 0) {
            JsonNode firstCustomer = data.get("data").get(0);
            candidates = new String[]{
                    getTextValue(firstCustomer, "telephoneNo"),
                    getTextValue(firstCustomer, "telephone"),
                    getTextValue(firstCustomer, "mobileNo"),
                    getTextValue(firstCustomer, "mobileNumber"),
                    extractFromTelephoneNos(firstCustomer)
            };
        }

        if (data.has("data") && data.get("data").isObject()) {
            JsonNode nestedCustomer = data.get("data");
            candidates = new String[]{
                    getTextValue(nestedCustomer, "telephoneNo"),
                    getTextValue(nestedCustomer, "telephone"),
                    getTextValue(nestedCustomer, "mobileNo"),
                    getTextValue(nestedCustomer, "mobileNumber"),
                    extractFromTelephoneNos(nestedCustomer)
            };
        }

        // Return first valid mobile number
        for (String candidate : candidates) {
            String normalized = mobileNumberUtil.normalizeMobileNumber(candidate);
            if (!normalized.isEmpty()) {
                return normalized;
            }
        }

        return "";
    }

    private String extractFromTelephoneNos(JsonNode node) {
        if (node == null || !node.has("telephoneNos") || !node.get("telephoneNos").isArray() || node.get("telephoneNos").isEmpty()) {
            return "";
        }

        JsonNode firstTelephone = node.get("telephoneNos").get(0);
        if (firstTelephone == null) {
            return "";
        }

        String[] fields = {"telephoneNo", "telephone", "mobileNo", "mobileNumber", "number", "value"};
        for (String field : fields) {
            String value = getTextValue(firstTelephone, field);
            String normalized = mobileNumberUtil.normalizeMobileNumber(value);
            if (!normalized.isEmpty()) {
                return normalized;
            }
        }

        return mobileNumberUtil.normalizeMobileNumber(firstTelephone.asText(""));
    }

    private String getTextValue(JsonNode node, String fieldName) {
        if (node != null && node.has(fieldName)) {
            return node.get(fieldName).asText("");
        }
        return "";
    }

    private String getFirstTextValue(JsonNode node, String... fieldNames) {
        if (node == null) {
            return "";
        }

        for (String fieldName : fieldNames) {
            String value = getTextValue(node, fieldName);
            if (!value.isBlank()) {
                return value;
            }
        }

        return "";
    }

    private double getFirstDoubleValue(JsonNode node, String... fieldNames) {
        if (node == null) {
            return 0d;
        }

        for (String fieldName : fieldNames) {
            if (node.has(fieldName) && !node.get(fieldName).isNull()) {
                try {
                    return node.get(fieldName).asDouble(0d);
                } catch (Exception ignored) {
                    // keep trying other fields
                }
            }
        }

        return 0d;
    }

    private String getAuthToken() {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String requestBody = String.format("{\"username\": \"%s\", \"password\": \"%s\"}", apiUsername, apiPassword);
            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            String endpoint = customerBalanceUrl + "/api/Auth/login";
            ResponseEntity<String> response = restTemplate.postForEntity(endpoint, request, String.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new ExternalApiException("Authentication failed", response.getStatusCode().value());
            }

            JsonNode responseData = objectMapper.readTree(response.getBody());
            
            // Extract token from response (try multiple field names)
            if (responseData.has("token")) {
                return responseData.get("token").asText();
            } else if (responseData.has("access_token")) {
                return responseData.get("access_token").asText();
            } else if (responseData.has("jwt")) {
                return responseData.get("jwt").asText();
            } else if (responseData.has("bearerToken")) {
                return responseData.get("bearerToken").asText();
            }

            throw new ExternalApiException("Invalid authentication response", 401);

        } catch (Exception e) {
            log.error("Error authenticating with external API", e);
            throw new ExternalApiException("Failed to authenticate with API", 401);
        }
    }
}

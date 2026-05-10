package com.ceb.portal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDetailsDto {
    private String accountNumber;
    private String customerName;
    private String address;
    private String tariff;
    private String customerType;
    private String billingMonth;
    private Double currentBalance;
    private Double units;
    private String phone;
    private String email;
    private String status;
    private Double lastPaymentAmount;
    private String lastPaymentDate;
    private Double previousReading;
    private Double currentReading;
    private List<PaymentDto> recentPayments;
}

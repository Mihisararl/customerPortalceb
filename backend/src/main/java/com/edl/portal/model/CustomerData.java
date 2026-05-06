package com.edl.portal.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerData {
    private String accountNumber;
    private String customerName;
    private String address;
    private String tariff;
    private String customerType;
    private String billingMonth;
    private Double currentBalance;
    private Double units;
    private Double lastPaymentAmount;
    private String lastPaymentDate;
    private Double previousReading;
    private Double currentReading;
    private String status;
    private String email;
    private String phone;
    private List<Payment> recentPayments;
    
    @JsonIgnore
    private String mobileNo;
}

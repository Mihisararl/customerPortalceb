package com.edl.portal.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    private Double paidAmount;
    private String paidDate;
    private String paymentMethod;
    private String referenceNumber;
}

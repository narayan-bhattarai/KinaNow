package com.kinanow.order.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "t_shipping_details")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShippingDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String address;
    private String city;
    private String country;
    private String zipCode;

    @Enumerated(EnumType.STRING)
    private ShippingStatus status;

    private LocalDateTime lastUpdated;

    @PrePersist
    @PreUpdate
    public void updateTimestamp() {
        lastUpdated = LocalDateTime.now();
    }
}

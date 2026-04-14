package com.project.Backend.busTracker.model;

import lombok.Data;
import java.time.Instant;

@Data
public class BusLocation {
    private String busId;
    private String routeName;
    private double lat;
    private double lng;
    private double speedKmh;
    private Instant timestamp;
}
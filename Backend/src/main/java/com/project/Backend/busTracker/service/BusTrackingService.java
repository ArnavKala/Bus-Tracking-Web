package com.project.Backend.busTracker.service;

import com.project.Backend.busTracker.model.BusLocation;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class BusTrackingService {

    private final SimpMessagingTemplate messaging;
    private final Map<String, BusLocation> activeBuses = new ConcurrentHashMap<>();


    @PostConstruct
    public void loadDummyData() {
        BusLocation bus1 = new BusLocation();
        bus1.setBusId("BUS-101");
        bus1.setRouteName("Route A");
        bus1.setLat(12.9716);
        bus1.setLng(77.5946);
        bus1.setSpeedKmh(30);

        BusLocation bus2 = new BusLocation();
        bus2.setBusId("BUS-202");
        bus2.setRouteName("Route B");
        bus2.setLat(12.9352);
        bus2.setLng(77.6245);
        bus2.setSpeedKmh(25);

        activeBuses.put(bus1.getBusId(), bus1);
        activeBuses.put(bus2.getBusId(), bus2);
    }

    public void updateLocation(BusLocation location) {
        location.setTimestamp(Instant.now());
        activeBuses.put(location.getBusId(), location);
        // Broadcast updated bus list to all connected React clients
        messaging.convertAndSend("/topic/buses", activeBuses.values());
    }

    public Collection<BusLocation> getAllBuses() {
        return activeBuses.values();
    }

    public BusLocation getBusById(String busId) {
        return activeBuses.get(busId);
    }
}
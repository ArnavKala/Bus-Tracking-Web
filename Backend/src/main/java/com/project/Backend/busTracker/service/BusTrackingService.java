package com.project.Backend.busTracker.service;

import com.project.Backend.busTracker.model.BusLocation;
import com.project.Backend.busTracker.repository.BusLocationRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collection;

@Service
@RequiredArgsConstructor
public class BusTrackingService {

    private final SimpMessagingTemplate messaging;
    private final BusLocationRepository repository;

    @PostConstruct
    public void loadInitialBuses() {
        messaging.convertAndSend("/topic/buses", repository.findAll());
    }

    public void updateLocation(BusLocation location) {
        location.setTimestamp(Instant.now());
        repository.save(location);
        messaging.convertAndSend("/topic/buses", repository.findAll());
    }

    public Collection<BusLocation> getAllBuses() {
        return repository.findAll();
    }

    public BusLocation getBusById(String busId) {
        return repository.findById(busId).orElse(null);
    }
}
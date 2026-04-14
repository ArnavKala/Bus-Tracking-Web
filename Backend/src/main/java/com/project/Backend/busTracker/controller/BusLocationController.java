package com.project.Backend.busTracker.controller;

import com.project.Backend.busTracker.model.BusLocation;
import com.project.Backend.busTracker.model.StopEta;
import com.project.Backend.busTracker.service.BusTrackingService;
import com.project.Backend.busTracker.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/api/bus")
@RequiredArgsConstructor
public class BusLocationController {

    private final BusTrackingService trackingService;
    private final GeminiService geminiService;

    // Driver app calls this every 5–10 seconds
    @PostMapping("/location")
    public ResponseEntity<Void> updateLocation(@RequestBody BusLocation location) {
        trackingService.updateLocation(location);
        return ResponseEntity.ok().build();
    }

    // React calls this to get all active buses on load
    @GetMapping("/all")
    public ResponseEntity<Collection<BusLocation>> getAllBuses() {
        return ResponseEntity.ok(trackingService.getAllBuses());
    }

    // React calls this when user clicks a bus marker
    @GetMapping("/{busId}/eta")
    public ResponseEntity<List<StopEta>> getEta(
            @PathVariable String busId,
            @RequestParam List<String> stops,
            @RequestParam List<Double> distances
    ) {
        BusLocation bus = trackingService.getBusById(busId);
        if (bus == null) {
            return ResponseEntity.notFound().build();
        }
        List<StopEta> etas = geminiService.estimateETAs(bus, stops, distances);
        return ResponseEntity.ok(etas);
    }
}
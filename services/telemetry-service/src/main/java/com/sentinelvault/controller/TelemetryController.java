package com.sentinelvault.controller;

import com.sentinelvault.model.TelemetryEvent;
import com.sentinelvault.service.TelemetryService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/internal/telemetry")
public class TelemetryController {
    private final TelemetryService service;
    private final String internalToken;

    public TelemetryController(TelemetryService service,
        @Value("${sentinelvault.internal-token}") String internalToken) {
        this.service = service;
        this.internalToken = internalToken;
    }

    private void authorize(String token) {
        if (token == null || !token.equals(internalToken))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid internal service token");
    }

    @PostMapping
    public TelemetryEvent ingest(@RequestHeader(value="X-Internal-Token", required=false) String token,
                                 @RequestBody @Valid TelemetryEvent event) {
        authorize(token);
        if (event.getEndpointId() == null || event.getEndpointId().isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "endpointId is required");
        if (event.getEventType() == null || event.getEventType().isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "eventType is required");
        return service.ingest(event);
    }

    @GetMapping
    public List<TelemetryEvent> latest(@RequestHeader(value="X-Internal-Token", required=false) String token,
                                       @RequestParam(required=false) String severity) {
        authorize(token);
        return service.latest(severity);
    }

    @GetMapping("/stats")
    public Map<String, Long> stats(@RequestHeader(value="X-Internal-Token", required=false) String token) {
        authorize(token);
        return Map.of("totalEvents", service.count(), "highSeverityEvents", service.highSeverityCount());
    }
}

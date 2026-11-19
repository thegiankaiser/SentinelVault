package com.sentinelvault.service;

import com.sentinelvault.model.TelemetryEvent;
import com.sentinelvault.repository.TelemetryRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class TelemetryService {
    private final TelemetryRepository repository;
    public TelemetryService(TelemetryRepository repository) { this.repository = repository; }

    public TelemetryEvent ingest(TelemetryEvent event) {
        if (event.getTimestamp() == null) event.setTimestamp(Instant.now());
        return repository.save(event);
    }

    public List<TelemetryEvent> latest(String severity) {
        if (severity != null && !severity.isBlank()) {
            return repository.findBySeverityOrderByTimestampDesc(severity.toUpperCase());
        }
        return repository.findTop100ByOrderByTimestampDesc();
    }

    public long count() { return repository.count(); }
    public long highSeverityCount() { return repository.findBySeverityOrderByTimestampDesc("HIGH").size(); }
}

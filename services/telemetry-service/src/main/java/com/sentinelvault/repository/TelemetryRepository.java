package com.sentinelvault.repository;

import com.sentinelvault.model.TelemetryEvent;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TelemetryRepository extends MongoRepository<TelemetryEvent, String> {
    List<TelemetryEvent> findTop100ByOrderByTimestampDesc();
    List<TelemetryEvent> findBySeverityOrderByTimestampDesc(String severity);
}

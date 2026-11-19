package com.sentinelvault.service;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import com.sentinelvault.model.TelemetryEvent;
import com.sentinelvault.repository.TelemetryRepository;
import java.time.Instant;
import org.junit.jupiter.api.Test;

class TelemetryServiceTest {
    @Test void ingestAddsTimestampAndPersists() {
        TelemetryRepository repository = mock(TelemetryRepository.class);
        TelemetryEvent event = new TelemetryEvent();
        when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        TelemetryEvent saved = new TelemetryService(repository).ingest(event);
        assertNotNull(saved.getTimestamp());
        verify(repository).save(event);
    }
}

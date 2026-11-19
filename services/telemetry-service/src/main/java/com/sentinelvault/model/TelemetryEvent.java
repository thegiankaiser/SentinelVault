package com.sentinelvault.model;

import java.time.Instant;
import java.util.Map;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("telemetry_events")
public class TelemetryEvent {
    @Id private String id;
    private Instant timestamp;
    private Metadata metadata;
    private String userId;
    private String eventType;
    private String sourceIp;
    private String severity;
    private Map<String, Object> details;

    public static class Metadata {
        private String endpointId;
        public Metadata() {}
        public Metadata(String endpointId) { this.endpointId = endpointId; }
        public String getEndpointId() { return endpointId; }
        public void setEndpointId(String endpointId) { this.endpointId = endpointId; }
    }
    public TelemetryEvent() {}
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    public Metadata getMetadata() { return metadata; }
    public void setMetadata(Metadata metadata) { this.metadata = metadata; }
    public String getEndpointId() { return metadata == null ? null : metadata.getEndpointId(); }
    public void setEndpointId(String endpointId) { this.metadata = new Metadata(endpointId); }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getSourceIp() { return sourceIp; }
    public void setSourceIp(String sourceIp) { this.sourceIp = sourceIp; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public Map<String, Object> getDetails() { return details; }
    public void setDetails(Map<String, Object> details) { this.details = details; }
}

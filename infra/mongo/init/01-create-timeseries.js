const database = db.getSiblingDB("sentinelvault");
const existing = database.getCollectionInfos({ name: "telemetry_events" });
if (existing.length === 0) {
  database.createCollection("telemetry_events", {
    timeseries: {
      timeField: "timestamp",
      metaField: "metadata",
      granularity: "seconds"
    }
  });
}
database.telemetry_events.createIndex({ "metadata.endpointId": 1, timestamp: -1 });
database.telemetry_events.createIndex({ eventType: 1, timestamp: -1 });
database.telemetry_events.createIndex({ severity: 1, timestamp: -1 });

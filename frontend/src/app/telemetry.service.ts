import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TelemetryEvent {
  id?: string; timestamp?: string; endpointId?: string; userId?: string;
  eventType: string; sourceIp?: string; severity: string; details?: Record<string, unknown>;
}
export interface Stats { totalEvents: number; highSeverityEvents: number; }

@Injectable({ providedIn: 'root' })
export class TelemetryService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/api';
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.base}/auth/login`, { email, password });
  }
  events(): Observable<TelemetryEvent[]> {
    return this.http.get<TelemetryEvent[]>(`${this.base}/telemetry`);
  }
  stats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.base}/telemetry/stats`);
  }
}

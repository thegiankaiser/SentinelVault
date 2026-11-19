import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TelemetryService, TelemetryEvent, Stats } from './telemetry.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <main class="shell">
    <header class="topbar">
      <div><div class="eyebrow">SECURITY OPERATIONS CENTER</div><h1>SentinelVault</h1></div>
      <div class="status"><span class="dot"></span> TELEMETRY CONSOLE</div>
    </header>

    <section class="login panel" *ngIf="!token">
      <div><p class="eyebrow">IDENTITY ACCESS</p><h2>Sign in to your workspace</h2>
      <p class="muted">Local demo account: admin@sentinelvault.local</p></div>
      <form (ngSubmit)="login()">
        <label>Email<input name="email" type="email" [(ngModel)]="email" required></label>
        <label>Password<input name="password" type="password" [(ngModel)]="password" required></label>
        <button>Authenticate</button>
        <p class="error" *ngIf="error">{{error}}</p>
      </form>
    </section>

    <ng-container *ngIf="token">
      <section class="welcome"><div><p class="eyebrow">LIVE THREAT OVERVIEW</p><h2>Endpoint telemetry</h2>
      <p class="muted">Recent identity and endpoint activity across your simulated environment.</p></div>
      <button class="secondary" (click)="refresh()">Refresh data</button></section>

      <section class="metrics">
        <article class="metric panel"><span class="muted">TOTAL EVENTS</span><strong>{{stats?.totalEvents ?? '—'}}</strong><small>Persisted telemetry records</small></article>
        <article class="metric panel"><span class="muted">HIGH SEVERITY</span><strong class="danger">{{stats?.highSeverityEvents ?? '—'}}</strong><small>Events requiring review</small></article>
        <article class="metric panel"><span class="muted">SERVICE STATUS</span><strong class="healthy">Connected</strong><small>Gateway session active</small></article>
      </section>

      <section class="panel table-panel">
        <div class="table-head"><div><p class="eyebrow">EVENT STREAM</p><h3>Latest telemetry</h3></div><span class="muted">{{events.length}} records</span></div>
        <p class="muted" *ngIf="!events.length">No events returned. Ingest a test event using the API quick test in the README.</p>
        <div class="table-wrap" *ngIf="events.length">
          <table><thead><tr><th>TIME</th><th>ENDPOINT</th><th>EVENT</th><th>SOURCE IP</th><th>SEVERITY</th></tr></thead>
          <tbody><tr *ngFor="let event of events">
            <td>{{event.timestamp | date:'short'}}</td><td>{{event.endpointId || '—'}}</td>
            <td>{{event.eventType}}</td><td>{{event.sourceIp || '—'}}</td>
            <td><span class="pill" [class.high]="event.severity === 'HIGH'">{{event.severity}}</span></td>
          </tr></tbody></table>
        </div>
        <p class="error" *ngIf="error">{{error}}</p>
      </section>
      <button class="logout" (click)="logout()">Sign out</button>
    </ng-container>
    <footer>SentinelVault <span>Distributed Identity &amp; Telemetry Platform · Portfolio MVP</span></footer>
  </main>`
})
export class AppComponent {
  private api = inject(TelemetryService);
  email = 'admin@sentinelvault.local';
  password = 'ChangeMe123!';
  token = localStorage.getItem('sentinelvault_token') || '';
  error = '';
  events: TelemetryEvent[] = [];
  stats: Stats | null = null;

  constructor() { if (this.token) this.refresh(); }

  login() {
    this.error = '';
    this.api.login(this.email, this.password).subscribe({
      next: result => { this.token = result.accessToken; localStorage.setItem('sentinelvault_token', this.token); this.refresh(); },
      error: () => this.error = 'Authentication failed. Check the API gateway and demo credentials.'
    });
  }
  refresh() {
    this.error = '';
    this.api.events().subscribe({ next: data => this.events = data, error: () => this.error = 'Unable to load telemetry. Is the API gateway and Spring service running?' });
    this.api.stats().subscribe({ next: data => this.stats = data, error: () => this.error = 'Unable to load telemetry statistics.' });
  }
  logout() { this.token = ''; localStorage.removeItem('sentinelvault_token'); this.events = []; this.stats = null; }
}

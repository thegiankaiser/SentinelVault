import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('creates the dashboard shell', async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient()]
    }).compileComponents();
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('SentinelVault');
  });
});

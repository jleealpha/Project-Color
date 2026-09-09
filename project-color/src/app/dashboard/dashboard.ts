import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { TestApiService, TestConfig } from '../services/test-api.service';

@Component({
  imports: [RouterLink],
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  protected readonly testConfig = signal<TestConfig | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly error = signal<string | null>(null);

  constructor(
    private testApiService: TestApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTestConfiguration();
  }

  private loadTestConfiguration(): void {
    this.isLoading.set(true);
    this.error.set(null);
    console.log('[Dashboard] Loading test configuration');

    this.testApiService.getTestConfiguration().subscribe({
      next: (config) => {
        console.log('[Dashboard] Test configuration loaded:', config);
        this.testConfig.set(config);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('[Dashboard] Failed to load test configuration:', err);
        this.error.set('Failed to load test configuration. Please ensure the backend is running.');
        this.isLoading.set(false);
      },
    });
  }

  protected startTest(): void {
    console.log('[Dashboard] Starting test');
    this.router.navigate(['/test-info']);
  }
}

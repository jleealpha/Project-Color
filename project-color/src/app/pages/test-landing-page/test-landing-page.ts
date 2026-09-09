import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BackNav } from '../../shared/back-nav/back-nav';

@Component({
  imports: [BackNav, CommonModule],
  selector: 'app-test-landing-page',
  styleUrl: './test-landing-page.scss',
  templateUrl: './test-landing-page.html',
})
export class TestLandingPage {
  protected readonly acknowledged = signal(false);

  constructor(private router: Router) {}

  protected toggleAcknowledgment(): void {
    this.acknowledged.set(!this.acknowledged());
  }

  protected beginTest(): void {
    if (this.acknowledged()) {
      console.log('[TestLandingPage] Beginning test');
      this.router.navigate(['/ishihara']);
    }
  }
}

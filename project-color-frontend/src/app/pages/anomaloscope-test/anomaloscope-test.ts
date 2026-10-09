import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BackNav } from '../../shared/back-nav/back-nav';
import { RotaryKnob } from '../../shared/rotary-knob/rotary-knob';
import { TestApiService } from '../../services/test-api.service';

@Component({
  imports: [BackNav, RotaryKnob],
  selector: 'app-anomaloscope-test',
  styleUrl: './anomaloscope-test.scss',
  templateUrl: './anomaloscope-test.html',
})
export class AnomaloscopeTest {
  /** 0 = pure red, 100 = pure green. Drives the adjustable mixture color. */
  protected readonly mixtureValue = signal(35);
  /** 0 = dim, 100 = bright. Drives the fixed-hue test color the user matches against. */
  protected readonly brightnessValue = signal(60);

  private readonly colorId = 1;

  constructor(
    private testApiService: TestApiService,
    private router: Router
  ) {}

  protected get mixtureColor(): string {
    const t = this.mixtureValue() / 100;
    const hue = t * 90; // red (0deg) through orange to yellow-green (90deg)
    return `hsl(${hue}, 90%, 50%)`;
  }

  protected get testColor(): string {
    const lightness = 42 + (this.brightnessValue() / 100) * 28;
    return `hsl(48, 100%, ${lightness}%)`;
  }

  protected onMixtureChange(value: number): void {
    this.mixtureValue.set(value);
  }

  protected onBrightnessChange(value: number): void {
    this.brightnessValue.set(value);
  }

  protected submitMatch(): void {
    const match = {
      colorId: this.colorId,
      matchedHue: Math.round((this.mixtureValue() / 100) * 90),
      matchedSaturation: 90,
      matchedIntensity: Math.round(this.brightnessValue()),
    };

    console.log('[AnomaloscopeTest] Submitting match', match);
    this.testApiService.submitAnomaloscopeTest([match]).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => console.error('[AnomaloscopeTest] Failed to submit match:', err),
    });
  }
}

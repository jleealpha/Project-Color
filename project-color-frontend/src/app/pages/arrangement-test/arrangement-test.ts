import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BackNav } from '../../shared/back-nav/back-nav';
import { TestApiService } from '../../services/test-api.service';
import {
  Swatch,
  TRAY_COUNT,
  buildMicroScale,
  buildTrays,
  findConfusionCenter,
  findDisplaced,
  shuffleMiddle,
} from '../../services/arrangement-colors';

type Phase = 'interlock' | 'stage1' | 'stage2' | 'submitting';

@Component({
  imports: [BackNav],
  selector: 'app-arrangement-test',
  styleUrl: './arrangement-test.scss',
  templateUrl: './arrangement-test.html',
})
export class ArrangementTest {
  protected readonly trayCount = TRAY_COUNT;
  protected readonly phase = signal<Phase>('interlock');
  protected readonly trayIndex = signal(0);
  protected readonly arrangement = signal<Swatch[]>([]);
  protected readonly selectedIndex = signal<number | null>(null);
  protected readonly dragIndex = signal<number | null>(null);

  protected readonly checks = signal({ nightShift: false, trueTone: false, brightness: false });
  protected readonly allChecked = computed(() => Object.values(this.checks()).every(Boolean));
  protected readonly p3Supported =
    typeof matchMedia === 'function' && matchMedia('(color-gamut: p3)').matches;

  private readonly trays = buildTrays();
  private readonly stage1Results: Swatch[][] = [];
  private stage2Result: Swatch[] = [];

  constructor(
    private testApiService: TestApiService,
    private router: Router,
  ) {}

  protected toggleCheck(key: 'nightShift' | 'trueTone' | 'brightness'): void {
    this.checks.update((c) => ({ ...c, [key]: !c[key] }));
  }

  protected begin(): void {
    if (!this.allChecked()) {
      return;
    }
    this.phase.set('stage1');
    this.loadTray(0);
  }

  protected selectSwatch(index: number): void {
    const current = this.arrangement();
    if (current[index].fixed) {
      return;
    }
    const selected = this.selectedIndex();
    if (selected === null) {
      this.selectedIndex.set(index);
    } else if (selected === index) {
      this.selectedIndex.set(null);
    } else {
      const next = [...current];
      [next[selected], next[index]] = [next[index], next[selected]];
      this.arrangement.set(next);
      this.selectedIndex.set(null);
    }
  }

  protected onDragStart(index: number): void {
    if (!this.arrangement()[index].fixed) {
      this.dragIndex.set(index);
      this.selectedIndex.set(null);
    }
  }

  protected onDrop(target: number): void {
    const from = this.dragIndex();
    this.dragIndex.set(null);
    const current = this.arrangement();
    if (from === null || from === target || current[target].fixed) {
      return;
    }
    const next = [...current];
    const [moved] = next.splice(from, 1);
    next.splice(target, 0, moved);
    this.arrangement.set(next);
  }

  protected submitArrangement(): void {
    const arranged = this.arrangement();
    if (this.phase() === 'stage2') {
      this.stage2Result = arranged;
      this.submit();
      return;
    }

    this.stage1Results.push(arranged);
    const next = this.trayIndex() + 1;
    if (next < TRAY_COUNT) {
      this.loadTray(next);
      return;
    }

    const displaced = new Map<number, Swatch>();
    this.stage1Results.forEach((tray) => findDisplaced(tray).forEach((s) => displaced.set(s.id, s)));
    const center = findConfusionCenter([...displaced.values()]);
    console.log('[ArrangementTest] Confusion axis center (nm):', center);

    if (center === null) {
      this.submit();
      return;
    }
    this.phase.set('stage2');
    this.arrangement.set(shuffleMiddle(buildMicroScale(center)));
    this.selectedIndex.set(null);
  }

  private loadTray(index: number): void {
    this.trayIndex.set(index);
    this.arrangement.set(shuffleMiddle(this.trays[index]));
    this.selectedIndex.set(null);
  }

  private submit(): void {
    this.phase.set('submitting');
    const responses = [...this.stage1Results, this.stage2Result]
      .filter((tray) => tray.length > 0)
      .flatMap((tray) => tray.map((s) => s.id));

    console.log('[ArrangementTest] Submitting responses', responses);
    this.testApiService.submitArrangementTest(responses).subscribe({
      next: () => this.router.navigate(['/anomaloscope']),
      error: (err) => {
        console.error('[ArrangementTest] Failed to submit arrangement:', err);
        this.phase.set(this.stage2Result.length > 0 ? 'stage2' : 'stage1');
      },
    });
  }
}

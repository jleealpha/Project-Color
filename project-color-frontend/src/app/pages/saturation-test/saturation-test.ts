import { Component, HostListener, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BackNav } from '../../shared/back-nav/back-nav';

type Direction = 'left' | 'right';
type Phase = 'active' | 'complete';

interface NoiseDot {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly opacity: number;
  readonly luminance: number;
}

interface Response {
  trial: number;
  saturation: number;
  correct: boolean;
}

//TODO make starting saturation based on confusion line from previous 2 tests
const START_SATURATION = 72;
const NOISE_DOT_COUNT = 150;
//generate an array of noise dots for the background
const NOISE_DOTS: readonly NoiseDot[] = Array.from({ length: NOISE_DOT_COUNT }, (_, index) => ({
  id: index,
  x: (index * 61.8) % 100, //produces an x position between 0 and 100
  y: (index * 37.7) % 100, //produces a y position between 0 and 100
  size: 1 + ((index * 17) % 3), //produces a size between 1 and 3
  opacity: 0.2 + ((index * 29) % 50) / 100, //produces an opacity between 0.2 and 0.7
  luminance: 90 + ((index * 43) % 90), //produces a luminance between 90 and 179
}));

@Component({
  imports: [BackNav],
  selector: 'app-saturation-test',
  styleUrl: './saturation-test.scss',
  templateUrl: './saturation-test.html',
})
export class SaturationTest {
  protected readonly phase = signal<Phase>('active');
  protected readonly targetDirection = signal<Direction>('left');
  protected readonly saturation = signal(START_SATURATION);
  protected readonly errorStreak = signal(0);
  protected readonly feedback = signal<'correct' | 'incorrect' | null>(null);
  protected readonly responses = signal<Response[]>([]);
  protected readonly correctCount = computed(
    () => this.responses().filter((response) => response.correct).length,
  );
  //array of noise dots for the background
  protected readonly noiseDots = NOISE_DOTS;
  //array of chart points for the saturation over trials; only used for results chart
  protected readonly chartPoints = computed(() => {
    const history = this.responses();
    return history.map((response, index) => ({
      ...response,
      x: history.length === 1 ? 250 : 30 + (index / (history.length - 1)) * 440,
      y: 170 - response.saturation * 1.5,
    }));
  });
  protected readonly chartPolyline = computed(() =>
    this.chartPoints()
      .map((point) => `${point.x},${point.y}`)
      .join(' '),
  );

  //TODO generate direction sequence based on previous tests
  private readonly directionSequence: Direction[] = [
    'left',
    'right',
    'right',
    'left',
    'right',
    'left',
    'left',
    'right',
  ];

  constructor(private readonly router: Router) {}

  protected get targetColor(): string {
    const purity = this.saturation() / 100;
    const red = Math.round(128 + 127 * purity);
    const greenBlue = Math.round(128 * (1 - purity));
    return `rgb(${red}, ${greenBlue}, ${greenBlue})`;
  }

  protected chooseDirection(direction: Direction): void {
    if (this.phase() !== 'active') {
      return;
    }

    const correct = direction === this.targetDirection();
    const responseSaturation = this.saturation();
    const trial = this.responses().length + 1;
    this.responses.update((history) => [
      ...history,
      { trial, saturation: responseSaturation, correct },
    ]);
    this.feedback.set(correct ? 'correct' : 'incorrect');
    this.adjustSaturation(correct);
    this.targetDirection.set(this.directionSequence[trial % this.directionSequence.length]);
  }

  private adjustSaturation(correct: boolean): void {
    if (correct) {
      this.saturation.update((value) => Math.max(5, value - 6));
      this.errorStreak.set(0);
    } else if (this.errorStreak() === 1) {
      this.saturation.update((value) => Math.min(90, value + 10));
      this.errorStreak.set(0);
    } else {
      this.errorStreak.set(1);
    }
  }

  protected finishTest(): void {
    this.phase.set('complete');
  }

  protected returnToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  @HostListener('window:keydown', ['$event'])
  protected onWindowKeydown(event: KeyboardEvent): void {
    if (this.phase() !== 'active') {
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.chooseDirection('left');
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.chooseDirection('right');
    }
  }
}

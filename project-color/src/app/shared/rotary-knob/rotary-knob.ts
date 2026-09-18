import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

const MIN_ANGLE = -120;
const MAX_ANGLE = 120;

@Component({
  imports: [CommonModule],
  selector: 'app-rotary-knob',
  styleUrl: './rotary-knob.scss',
  templateUrl: './rotary-knob.html',
})
export class RotaryKnob {
  /** Text under the knob, e.g. "MIXTURE" or "TEST". */
  @Input() caption = '';
  /** Optional text above the dial arc, e.g. "BRIGHTNESS". */
  @Input() arcLabel = '';
  /** Label at the low end of the arc, e.g. "RED". Leave empty to hide. */
  @Input() minLabel = '';
  /** Label at the high end of the arc, e.g. "GREEN". Leave empty to hide. */
  @Input() maxLabel = '';
  @Input() minLabelClass = '';
  @Input() maxLabelClass = '';
  /** Number of dash ticks drawn along the arc. 0 disables ticks. */
  @Input() tickCount = 7;
  @Input() value = 50;

  @Output() valueChange = new EventEmitter<number>();

  protected readonly dragging = signal(false);

  @ViewChild('knobBody') private knobBody!: ElementRef<HTMLDivElement>;

  protected get pointerAngle(): number {
    return MIN_ANGLE + (this.value / 100) * (MAX_ANGLE - MIN_ANGLE);
  }

  protected get ticks(): number[] {
    return Array.from({ length: this.tickCount }, (_, i) => i);
  }

  protected tickAngle(index: number): number {
    if (this.tickCount <= 1) {
      return MIN_ANGLE;
    }
    return MIN_ANGLE + (index / (this.tickCount - 1)) * (MAX_ANGLE - MIN_ANGLE);
  }

  protected onPointerDown(event: PointerEvent): void {
    event.preventDefault();
    this.dragging.set(true);
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.dragging()) {
      return;
    }
    const rect = this.knobBody.nativeElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;

    let angleDeg = (Math.atan2(dx, -dy) * 180) / Math.PI;
    angleDeg = Math.max(MIN_ANGLE, Math.min(MAX_ANGLE, angleDeg));

    this.setValue(((angleDeg - MIN_ANGLE) / (MAX_ANGLE - MIN_ANGLE)) * 100);
  }

  protected onPointerUp(event: PointerEvent): void {
    this.dragging.set(false);
    (event.target as HTMLElement).releasePointerCapture(event.pointerId);
  }

  protected onKeyDown(event: KeyboardEvent): void {
    const step = event.shiftKey ? 10 : 2;
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
      event.preventDefault();
      this.setValue(this.value + step);
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
      event.preventDefault();
      this.setValue(this.value - step);
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.setValue(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      this.setValue(100);
    }
  }

  private setValue(next: number): void {
    this.value = Math.max(0, Math.min(100, next));
    this.valueChange.emit(this.value);
  }
}

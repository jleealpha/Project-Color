import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SaturationTest } from './saturation-test';

describe('SaturationTest', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaturationTest],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('decreases purity after a correct response', async () => {
    const fixture = TestBed.createComponent(SaturationTest);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('[data-direction="left"]').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Color purity: 66%');
  });

  it('increases purity after consecutive errors', async () => {
    const fixture = TestBed.createComponent(SaturationTest);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('[data-direction="right"]').click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('[data-direction="left"]').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Color purity: 82%');
  });

  it('shows the response profile when the user finishes', async () => {
    const fixture = TestBed.createComponent(SaturationTest);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('[data-direction="left"]').click();
    fixture.nativeElement.querySelector('.finish-button').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Your response profile');
    expect(fixture.nativeElement.textContent).toContain('1 of 1 trials correctly');
    expect(fixture.nativeElement.textContent).toContain('does not estimate cone function');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestLandingPage } from './test-landing-page';

describe('TestLandingPage', () => {
  let component: TestLandingPage;
  let fixture: ComponentFixture<TestLandingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestLandingPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TestLandingPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

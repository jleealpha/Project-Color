import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { TestLandingPage } from './pages/test-landing-page/test-landing-page';
import { ColorblindnessQa } from './pages/colorblindness-qa/colorblindness-qa';
import { AnomaloscopeTest } from './pages/anomaloscope-test/anomaloscope-test';
import { ArrangementTest } from './pages/arrangement-test/arrangement-test';

export const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'test-info', component: TestLandingPage },
  { path: 'test', component: TestLandingPage },
  { path: 'qa', component: ColorblindnessQa },
  { path: 'arrangement', component: ArrangementTest },
  { path: 'anomaloscope', component: AnomaloscopeTest },
  { path: '**', redirectTo: 'dashboard' },
];

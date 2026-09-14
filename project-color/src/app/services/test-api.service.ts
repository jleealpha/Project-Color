import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TestConfig {
  arrangementPlateCount: number;
  anomaloscopeColors: AnomaloscopeColor[];
  version: string;
}

export interface AnomaloscopeColor {
  id: number;
  name: string;
  axis: string;
  referenceHue: number;
  referenceSaturation: number;
  referenceIntensity: number;
}

export interface TestResult {
  hasDeficiency: boolean;
  classification: string;
  plainLanguageExplanation: string;
  testedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class TestApiService {
  private apiUrl = 'https://localhost:7275/api/v1';

  constructor(private http: HttpClient) {}

  getTestConfiguration(): Observable<TestConfig> {
    console.log('[TestApiService] Fetching test configuration from backend');
    return this.http.get<TestConfig>(`${this.apiUrl}/tests/config`);
  }

  submitArrangementTest(responses: number[]): Observable<{ received: boolean }> {
    console.log(`[TestApiService] Submitting arrangement test with ${responses.length} responses`);
    return this.http.post<{ received: boolean }>(`${this.apiUrl}/tests/Arrangement/submit`, {
      responses,
    });
  }

  submitAnomaloscopeTest(matches: any[]): Observable<TestResult> {
    console.log(`[TestApiService] Submitting anomaloscope test with ${matches.length} matches`);
    return this.http.post<TestResult>(`${this.apiUrl}/tests/anomaloscope/submit`, {
      matches,
    });
  }

  scoreTest(request: any): Observable<TestResult> {
    console.log('[TestApiService] Scoring test');
    return this.http.post<TestResult>(`${this.apiUrl}/tests/score`, request);
  }
}

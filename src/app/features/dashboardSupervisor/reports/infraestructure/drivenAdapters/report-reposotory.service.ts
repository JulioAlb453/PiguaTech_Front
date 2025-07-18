import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs';

import { ReportRequest } from '../../domain/models/report-request';
import { ReportFormat } from '../../domain/models/report-format.enum';
import { ReportType } from '../../domain/models/report-type.enum';
import { GeneratedReport } from '../../domain/models/generated-report';

@Injectable({
  providedIn: 'root',
})
export class ReportReposotoryService {
  constructor() {}

  //simulacion de datos

  fechPreviousReports(): Observable<GeneratedReport[]> {
    const mockReports: GeneratedReport[] = [
      {
        id: 'rep001',
        type: ReportType.currentState,
        dateRange: '01/01/2024 - 01/31/2024',
        format: ReportFormat.PDF,
        downloadUrl: '/mock-downloads/report-1.pdf',
      },
      {
        id: 'rep002',
        type: ReportType.historicalData,
        dateRange: '2020 - 2023',
        format: ReportFormat.CSV,
        downloadUrl: '/mock-downloads/report-2.csv',
      },
      {
        id: 'rep003',
        type: ReportType.growthAnalysis,
        dateRange: '2023 - 2024',
        format: ReportFormat.PDF,
        downloadUrl: '/mock-downloads/report-3.pdf',
      },
    ];
    return of(mockReports).pipe(delay(500));
  }

  requestNewReport(
    request: ReportRequest
  ): Observable<{ success: boolean; message: string }> {
    const mockReponse = {
      success: true,
      message:
        'El informe se está generando y se notificara en cuando este listo',
    };

    return of(mockReponse).pipe(delay(1000));
  }
}

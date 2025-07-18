import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GeneratedReport } from '../../reports/domain/models/generated-report';
import { ReportType } from '../../reports/domain/models/report-type.enum';
import { ReportFormat } from '../../reports/domain/models/report-format.enum';

@Component({
  selector: 'app-report-generator',
  standalone: false,
  templateUrl: './report-generator.component.html',
  styleUrl: './report-generator.component.scss',
})
export class ReportGeneratorComponent implements OnInit {
  reportForm!: FormGroup;
  reportTypes = Object.values(ReportType);
  ReportType = ReportType;
  ReportFormat = ReportFormat;
  isLoading = false;
  downloadFormats = Object.values(ReportFormat);

  previousReports: GeneratedReport[] = [
    {
      id: 'rep001',
      type: ReportType.currentState,
      dateRange: '01/31/2024',
      format: ReportFormat.PDF,
      downloadUrl: '#',
    },
    {
      id: 'rep002',
      type: ReportType.historicalData,
      dateRange: '05/11/2024',
      format: ReportFormat.CSV,
      downloadUrl: '#',
    },
    {
      id: 'rep003',
      type: ReportType.growthAnalysis,
      dateRange: '03/17/2024',
      format: ReportFormat.PDF,
      downloadUrl: '#',
    },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      reportType: [this.reportTypes[0], Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      downloadFormat: [this.downloadFormats[0], Validators.required],
    });
  }

  selectReportType(type: ReportType): void {
    this.reportForm.get('reportType')?.setValue(type);
  }

  selectDownloadFormat(format: ReportFormat): void {
    this.reportForm.get('downloadFormat')?.setValue(format);
  }
  generateReport(): void {
    this.reportForm.markAllAsTouched(); // Marcar todos los campos para mostrar errores

    if (this.reportForm.invalid) {
      console.error('El formulario es inválido.');
      return;
    }

    this.isLoading = true;
    console.log('Generando informe con los datos:', this.reportForm.value);

    // Simular una llamada a API
    setTimeout(() => {
      this.isLoading = false;
      alert('¡Informe generado con éxito!');
      // Aquí podrías añadir el nuevo informe a la lista de 'previousReports'
      this.reportForm.reset({
        reportType: this.reportTypes[0],
        downloadFormat: this.downloadFormats[0],
      });
    }, 2000);
  }

  downloadPrevious(report: GeneratedReport): void {
    console.log('Descargando informe:', report);
  }

  getReportTypeIcon(type: ReportType): string {
    const iconMap = {
      [ReportType.currentState]: 'assessment',
      [ReportType.historicalData]: 'timeline',
      [ReportType.growthAnalysis]: 'trending_up',
    };
    return iconMap[type] || 'description';
  }
  getFormatIcon(format: ReportFormat): string {
    const iconMap = {
      [ReportFormat.PDF]: 'picture_as_pdf',
      [ReportFormat.CSV]: 'table_chart',
    };
    return iconMap[format] || 'file_download';
  }


  
  deleteReport(report: GeneratedReport): void {
    console.log('Eliminando informe:', report);
    this.previousReports = this.previousReports.filter(
      (r) => r.id !== report.id
    );
  }
}

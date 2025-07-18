import { ReportType } from './report-type.enum';
import { ReportFormat } from './report-format.enum';
export interface GeneratedReport {
  id: string;
  type: ReportType;
  dateRange: string; //determina el rango de la fecha
  format: ReportFormat;
  downloadUrl: string; 
}

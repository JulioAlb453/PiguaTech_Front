import { ReportType } from "./report-type.enum";
import { ReportFormat } from "./report-format.enum";
export interface ReportRequest {

    reportType: ReportType
    startDate: string
    endDate: string
    downloadFormat: ReportFormat
}

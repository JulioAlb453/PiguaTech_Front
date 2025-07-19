import { Observable } from 'rxjs';
import { TimeRange } from '../models/time-range.enum';
import { TemperatureData } from '../models/temperature-data.model'; // Asegúrate de que este modelo exista

// Suponiendo que tu modelo de datos históricos se ve así:
export interface HistoricalTemperatureData {
  series: any[]; // O un tipo más específico
  categories: string[];
}

export abstract class IMonitoringService {
  // Este método ya lo tienes para datos históricos
  abstract getData(range: TimeRange): Observable<HistoricalTemperatureData>;

  // AÑADIMOS ESTE MÉTODO PARA TIEMPO REAL
  // Devuelve un flujo continuo de puntos de datos de temperatura.
  abstract getRealTimeData(): Observable<TemperatureData>; 
}
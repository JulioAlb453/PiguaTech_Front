// este modelo es para los datos de turbidez del agua

export interface WaterTurbidity {
  last_value: number;
  trend: number;
  series: number[];
  categories: string[];
}

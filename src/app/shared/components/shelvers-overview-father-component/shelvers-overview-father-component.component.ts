import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShelfStatus, ShelversOverviewComponent } from '../shelvers-overview/shelvers-overview.component';
import { Shelf } from '../shelvers-overview/shelvers-overview.component';

@Component({
  selector: 'app-shelvers-overview-father-component',
  imports: [CommonModule, ShelversOverviewComponent],
  templateUrl: './shelvers-overview-father-component.component.html',
  styleUrl: './shelvers-overview-father-component.component.scss',
})
export class ShelversOverviewFatherComponentComponent implements OnInit {
  //aqui los datos se enviaran al componente hijo
  public dataShelves: Shelf[] = [];
  public isLoading = true; //simulamos un estado de carga inicial
  public pageTitle = 'Resumen de estanques';

  constructor() {}

  ngOnInit(): void {
    this.fetchShelvesData();
    
  }

  fetchShelvesData(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.dataShelves = [
        {
          id: 1,
          name: 'Pecera 1',
          status: 'Optimo' as ShelfStatus,
          zone: 'Lado este del estanque',
        },
        {
          id: 2,
          name: 'Pecera 1',
          status: 'Alerta',
          zone: 'Lado este del estanque',
        },
        {
          id: 3,
          name: 'Pecera 1',
          status: 'Alerta',
          zone: 'Lado este del estanque',
        },
        {
          id: 4,
          name: 'Pecera 1',
          status: 'Atencion',
          zone: 'Lado este del estanque',
        },
        {
          id: 5,
          name: 'Pecera 1',
          status: 'Optimo',
          zone: 'Lado este del est',
        },
      ];
      this.isLoading = false;
    }, 2000);
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export type ShelfStatus = 'Optimo' | 'Atencion' | 'Alerta';
export interface Shelf {
  id: number;
  name: string;
  status: ShelfStatus;
  zone: string;
}

@Component({
  selector: 'app-shelvers-overview',
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatButtonModule,
    MatIconModule, MatTooltipModule
  ],
  templateUrl: './shelvers-overview.component.html',
  styleUrl: './shelvers-overview.component.scss',
})
export class ShelversOverviewComponent {
  //Se necesitara un componente padre para pasarle los datos
  @Input() title: string = 'Habitats activos';
  @Input() shelves: Shelf[] = []; // Arreglo de los cards
  @Input() basePath!: string; //Ruta para navegar entre los card respecto a su ID
  // Se notifica al componente padre que se creo un nuevo criadero
  @Output() addShelf = new EventEmitter<void>(); //Esto servira si es quiere aumentar el numero de estanques

  currentPage = 1;
  itemsPerPage = 6;


  //obtener el total de paginas que va a tener
  get totalPages(): number {
    return Math.ceil(this.shelves.length / this.itemsPerPage);
  }

  //Obtener la alerta correspondiente
  getOverallStatus(): string {
    if(this.shelves.some (s => s.status  === 'Alerta')) return 'Alerta'
    if(this.shelves.some(s => s.status === 'Atencion')) return 'Atencion'
    return 'Optimo'
  }

  //para la paginacion
  get paginatedShelves(): Shelf[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.shelves.slice(startIndex, endIndex);
  }

  // Esta funcion emite un evento para notificar al
  // componente padre que se añadira un nuevo estanque
  onAddShelfClick(): void {
    this.addShelf.emit();
  }
}

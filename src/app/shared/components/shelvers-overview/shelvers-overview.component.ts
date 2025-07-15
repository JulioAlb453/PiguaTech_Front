import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export type ShelftStatus = 'Optimo' | 'Atencion' | 'Alerta';
export interface Shelf {
  id: number;
  name: string;
  status: ShelftStatus;
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
  @Input() shelves: Shelf[] = [];
  @Input() basePath!: string;
  // Se notifica al componente padre que se creo un nuevo criadero
  @Output() addShelf = new EventEmitter<void>();

  currentPage = 1;
  itemsPerPage = 3;

  get totalPages(): number {
    return Math.ceil(this.shelves.length / this.itemsPerPage);
  }

  get paginatedShelves(): Shelf[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.shelves.slice(startIndex, endIndex);
  }

  onAddShelfClick(): void {
    this.addShelf.emit();
  }
}

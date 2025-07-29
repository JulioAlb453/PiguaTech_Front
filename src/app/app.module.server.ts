import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

// Opcional: puedes eliminar esta importación si no se usa en ningún otro lado.
// import { provideServerRendering } from '@angular/platform-server';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  providers: [

  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
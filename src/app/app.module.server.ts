import { NgModule } from '@angular/core';
import { provideServerRendering, ServerModule } from '@angular/platform-server';
import { withRoutes } from '@angular/ssr';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { serverRoutes } from './app.routes.server';

@NgModule({
  imports: [AppModule, ServerModule],
  providers: [provideServerRendering()],
  bootstrap: [AppComponent],
})
export class AppServerModule {}

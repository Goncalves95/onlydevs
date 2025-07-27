// src/app/app.component.ts
import { Component } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <h1>{{environment.app.name}}</h1>
      <p>Environment: {{environment.production ? 'Production' : 'Development'}}</p>
      <p>API URL: {{environment.apiUrl}}</p>
      <p>Version: {{environment.app.version}}</p>
      <p>Debug: {{environment.app.debug}}</p>
    </div>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  environment = environment;
}
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GovHeaderComponent } from './shared/components/gov-header/gov-header'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GovHeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('vlab-frontend-frota-gerencial');
}

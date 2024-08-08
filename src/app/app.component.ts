import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BudgetTableComponent } from "./budget-table/budget-table.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BudgetTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'budget-builder';
}

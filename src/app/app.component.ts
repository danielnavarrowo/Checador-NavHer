import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupabaseService } from './services/supabase.service';



@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html'
})


export class AppComponent implements OnInit {
  
  ngOnInit(): void {
    //Call to check if there are products in local storage.
    this.supabaseService.checkLocalStorage();
  }
  private supabaseService = inject(SupabaseService);
}

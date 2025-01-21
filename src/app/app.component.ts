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
    //Checar si hay información en caché para cargarla
    this.supabaseService.checkLocalStorage();
  }
  private supabaseService = inject(SupabaseService);
}

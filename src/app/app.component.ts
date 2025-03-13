import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  supabaseService = inject(SupabaseService);
  

  ngOnInit() {

    this.supabaseService.supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {

        this.supabaseService.currentUser.set(null);
        this.supabaseService.isLoggedIn.set(false);
        
      }
    });
  }  
}
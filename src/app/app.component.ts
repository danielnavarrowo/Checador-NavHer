import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  supabaseService = inject(SupabaseService);
  

  ngOnInit() {

    this.supabaseService.supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {

        this.supabaseService.currentUser.set(null);
        this.supabaseService.isLoggedIn.set(false);
        
      }
    });
  }  
}
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
  

  async ngOnInit() {



   /*  await this.checkSession(); */

    // Listen for auth changes
    this.supabaseService.supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        this.supabaseService.checkLocalStorage();
        this.supabaseService.currentUser.set({ email: session?.user.email! });
        this.supabaseService.isLoggedIn.set(true);
        
      } else if (event === 'SIGNED_OUT') {

        this.supabaseService.currentUser.set(null);
        this.supabaseService.isLoggedIn.set(false);
        
      }
    });
  }

  /* private async checkSession() {
    try {
      const { data: { session }, error } = await this.supabaseService.supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session) {
        // Verify if the session is still valid by making an authenticated request
        const { error: factorsError } = await this.supabaseService.supabase.auth.mfa.listFactors();
        
        if (factorsError) {
          // If there's an error, the session might be invalid
          this.supabaseService.logOut();
          this.supabaseService.currentUser.set(null);
          this.supabaseService.isLoggedIn.set(false);
        }
      }
    } catch (error) {
      console.error('Session check failed:', error);
      this.supabaseService.logOut();
      this.supabaseService.currentUser.set(null);
          this.supabaseService.isLoggedIn.set(false);
    }
  } */
  
}
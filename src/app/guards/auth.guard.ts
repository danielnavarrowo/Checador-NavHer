import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async (route, state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  // Get the current session
  const { data: { session } } = await supabaseService.supabase.auth.getSession();

  if (session) {
    supabaseService.checkLocalStorage();
    supabaseService.isLoggedIn.set(true);
    supabaseService.currentUser.set({ email: session.user.email! });
    return true;
  } else {
    // Pass the attempted URL in query params so we can redirect after login.
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};

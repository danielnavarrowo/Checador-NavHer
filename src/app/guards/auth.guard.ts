import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async (route, state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  // Get the current session
  const { data: { session } } = await supabaseService.supabase.auth.getSession();

  if (session) {
    supabaseService.isLoggedIn.set(true);
    supabaseService.currentUser.set({ email: session.user.email! });
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.prod'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  constructor() { }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private environment: Record<string, string> = {};

  constructor(private http: HttpClient) {}

  loadEnvironment(): Promise<void> {
    return this.http
      .get<Record<string, string>>('/assets/environment.json')
      .toPromise()
      .then(env => {
        this.environment = { ...env, ...this.getVercelEnv() };
      });
  }

  get(key: string): string {
    return this.environment[key] || '';
  }

  private getVercelEnv(): Record<string, string> {
    return {
      SUPABASE_URL: process.env['SUPABASE_URL'] || '',
      SUPABASE_KEY: process.env['SUPABASE_KEY'] || ''
    };
  }
}

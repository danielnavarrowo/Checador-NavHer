import { Injectable, signal } from '@angular/core'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { from, Observable, map } from 'rxjs'
import { Product } from '../interfaces/product.interface'
import { environment } from '../../environments/environment.prod'

//Main service for interacting with Supabase and managing the products list from the server and local storage.

@Injectable({ providedIn: 'root' })

export class SupabaseService {

  private supabase: SupabaseClient
  productsSignal = signal<Product[]>([]);

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl!,
      environment.supabaseKey!
    )
  }
  //Fetches the products from the server and returns them as an observable.
  fetchProducts(): Observable<Product[] | null> {
    return from(
      this.supabase.from('productos')
        .select('codigo, descripcion, pcosto, pventa, mayoreo')
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Error fetching product via RPC:', error);
          return null;
        }
        return data ? (data as Product[]) : null;
      })
    );
  }
  //Gets the last update date from the server so we can compare it with the local storage date.
  fetchLastUpdate(): Observable<Date | null> {
    return from(
      this.supabase.rpc('get_date')
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Error fetching product via RPC:', error);
          return null;
        }
        const date = new Date(data + 'T00:00:00');
        return date;
      })
    );
  }

  //Checks if there are any products saved in local storage, and if so, it compares the last update date with the server date to decide if it should update the products from the server.
  checkLocalStorage(): void {
    const localProducts = localStorage.getItem('Productos');
    const localStgDate = localStorage.getItem('lastUpdate') ? new Date(localStorage.getItem('lastUpdate') + 'T00:00:00') : null;

    // Immediately set the products from Local Storage if available
    if (localProducts) {
      this.productsSignal.set(JSON.parse(localProducts));
      console.log('Local Found')
    }

    // Fetch the last update date from the server
    this.fetchLastUpdate().subscribe((serverLastUpdate) => {
      const serverDate = new Date(serverLastUpdate!);
      // Check if the server data is newer or if no local date exists  
      if (!localProducts || !localStgDate || serverDate > localStgDate) {
        console.log('Fetching products from server and updating local storage.');
        this.fetchProducts().subscribe((listProducts) => {
          this.productsSignal.set(listProducts ? listProducts : []); // Update the signal with new products
          localStorage.setItem('Productos', JSON.stringify(listProducts)); // Update Local Storage
          localStorage.setItem('lastUpdate', serverLastUpdate!.toISOString().split('T')[0]); // Store the new update date
        });
      }
    });
  }
}

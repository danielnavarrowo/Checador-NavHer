import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { SupabaseService } from '../../../services/supabase.service';
import {
  AutoSizeVirtualScrollStrategy, // ScrollStrategy
  RxVirtualScrollViewportComponent, // Viewport
  RxVirtualFor, // ViewRepeater
} from '@rx-angular/template/experimental/virtual-scrolling';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Product } from '../../../interfaces/product.interface';



//Products list component. It shows a list of products and allows to search them by their description.


@Component({
  selector: 'app-products-list',
  imports: [
    DatePipe, DecimalPipe,
    RxVirtualFor, RxVirtualScrollViewportComponent, AutoSizeVirtualScrollStrategy, RouterLink
  ],
  templateUrl: './productsList.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductsListComponent {

  private readonly supabaseService = inject(SupabaseService);

  // Use a signal for the search term to trigger reactivity
  public readonly searchTerm = signal('');

  public readonly lastUpdate = localStorage.getItem('lastUpdate');

  // Computed signal for the filtered products
  readonly products = computed(() => {

    const allProducts = this.supabaseService.productsSignal();

    // Return all products if search term is empty
    if (this.searchTerm().trim() === '') return allProducts;

    // Return filtered products based on the search term
    return allProducts.filter(product =>
      product.descripcion.toLowerCase().includes(this.searchTerm().toLowerCase())
    );
  });

  // TrackBy function for better performance
  readonly trackByProductId = (index: number, product: Product): string => product.codigo;

  logOut(): void {
    this.supabaseService.logOut();
  }
}

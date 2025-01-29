import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';
import {
  AutoSizeVirtualScrollStrategy, // ScrollStrategy
  RxVirtualScrollViewportComponent, // Viewport
  RxVirtualFor, // ViewRepeater
} from '@rx-angular/template/experimental/virtual-scrolling';



//Products list component. It shows a list of products and allows to search them by their description.


@Component({
  selector: 'app-products-list',
  imports: [
    CommonModule,
    FormsModule,
    RxVirtualFor, RxVirtualScrollViewportComponent, AutoSizeVirtualScrollStrategy
  ],
  templateUrl: './productsList.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductsListComponent {

  private supabaseService = inject(SupabaseService);

  // Use a signal for the search term to trigger reactivity
  public searchTerm = signal('');

  public lastUpdate = localStorage.getItem('lastUpdate');

  // Computed signal for the filtered products
  products = computed(() => {

    const allProducts = this.supabaseService.productsSignal();

    // Return all products if search term is empty
    if (this.searchTerm().trim() === '') return allProducts;

    // Return filtered products based on the search term
    return allProducts.filter(product =>
      product.descripcion.toLowerCase().includes(this.searchTerm().toLowerCase())
    );
  });
}

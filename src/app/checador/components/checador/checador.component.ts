import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Product } from '../../../interfaces/product.interface';
import { SupabaseService } from '../../../services/supabase.service';
import { DecimalPipe } from '@angular/common';

//Price checker component. It allows to search a product by its barcode and shows the product information.

@Component({
  selector: 'app-checador',
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './checador.component.html',
  styles: `

  .main {
    background: #000000;
background: radial-gradient(circle, rgba(0, 0, 0, 1) 0%, rgba(135, 5, 31, 1) 100%);
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecadorComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  public readonly supabaseService = inject(SupabaseService);
  private readonly productSignal = signal<Product | null>(null);
  public readonly product = computed(() => this.productSignal());
  public readonly showResult = signal(false);
  private timeoutId: NodeJS.Timeout | undefined;

  public readonly myForm: FormGroup = this.fb.group({
    barcode: ['', Validators.required],
  });

  searchByBarcode(): void {
    //Used for restarting the timeout when a new search is made
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    const raw = (this.myForm.get('barcode')?.value ?? '') as string;
    const barcode = raw.trim().replace(/^0+/, ''); //Eleventa deletes any zero at the beginning of the barcode, so we do the same here

    // Pre-index lookup map lazily (simple micro-opt for large lists)
    const products = this.supabaseService.productsSignal();
    // Use for-of loop for better performance and readability
    let found: Product | null = null;
    for (const product of products) {
      if (product.codigo === barcode) {
        found = product;
        break;
      }
    }
    this.productSignal.set(found);
    this.myForm.reset();

    // Show the result
    this.showResult.set(true);

    // Hide after 10 seconds
    this.timeoutId = setTimeout(() => {
      this.showResult.set(false);
      this.productSignal.set(null);
      this.timeoutId = undefined;
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }
}

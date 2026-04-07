import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecadorComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  public readonly supabaseService = inject(SupabaseService);
  private readonly productSignal = signal<Product | null>(null);
  public readonly product = computed(() => this.productSignal());
  public readonly showResult = signal(false);
  private timeoutId: ReturnType<typeof setTimeout> | undefined;
  private timeIntervalId: ReturnType<typeof setInterval> | undefined;

  public readonly currentDate = signal<string>('');
  public readonly currentTime = signal<string>('');

  public readonly wallpaperNumber = signal(Math.floor(Math.random() * 15) + 1);
  public readonly wallpaperUrl = computed(() => `url('https://rabzabvoqwogqzonllnb.supabase.co/storage/v1/object/public/navher/wallpapers/wallpaper${this.wallpaperNumber()}.webp')`);

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

  ngOnInit(): void {
    this.updateDateTime();
    this.timeIntervalId = setInterval(() => this.updateDateTime(), 1000);
  }

  private updateDateTime(): void {
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
    this.currentDate.set(dateStr.charAt(0).toUpperCase() + dateStr.slice(1));
    
    const timeStr = now.toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit', hour12: true });
    this.currentTime.set(timeStr);
  }

  ngOnDestroy(): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    if (this.timeIntervalId) clearInterval(this.timeIntervalId);
  }
}

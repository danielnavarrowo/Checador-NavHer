import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../../interfaces/product.interface';
import { SupabaseService } from '../../../services/supabase.service';


@Component({
  selector: 'app-checador',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checador.component.html',
  styles: `
  .placeholder-center::placeholder {
	text-align: center;
  }

  .main {
    background: rgb(119,147,232);
    background: radial-gradient(circle, rgba(119,147,232,1) 14%, rgba(198,49,193,1) 44%, rgba(66,81,172,1) 100%);
  }

  .blurred {
    background: rgba(5,2,49,0.45);
-webkit-backdrop-filter: blur(2px);
backdrop-filter: blur(2px);
border: 1px solid rgba(5,2,49,0.225);
  }

  `
})

export class ChecadorComponent {

  private fb = inject(FormBuilder);
  private supabaseService = inject(SupabaseService);

  public product: Product | undefined = undefined;
  public showResult = signal(false);
  private timeoutId: NodeJS.Timeout | undefined;

  public myForm: FormGroup = this.fb.group({
    barcode: ['', Validators.required]
  });

  searchByBarcode() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    var barcode = this.myForm.get('barcode')?.value;
    barcode = barcode.replace(/^0+/, '');
    this.product = this.supabaseService.productsSignal().find(product =>
      product.codigo === barcode);
    this.myForm.reset();

    // Show the result
    this.showResult.set(true);

    // Hide after 10 seconds
    this.timeoutId = setTimeout(() => {
      this.showResult.set(false);
      this.product = undefined;
      this.timeoutId = undefined;
    }, 10000);
  }
}
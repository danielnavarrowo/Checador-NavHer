import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../../interfaces/product.interface';
import { SupabaseService } from '../../../services/supabase.service';

//Price checker component. It allows to search a product by its barcode and shows the product information.


@Component({
  selector: 'app-checador',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checador.component.html',
  styles: `

  .main {
    background: rgb(119,147,232);
    background: radial-gradient(circle, rgba(119,147,232,1) 14%, rgba(198,49,193,1) 44%, rgba(66,81,172,1) 100%);
  }

  .glass{
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 20px;
    border:2px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
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

    //Used for restarting the timeout when a new search is made
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    var barcode = this.myForm.get('barcode')?.value;
    barcode = barcode.replace(/^0+/, '');  //Eleventa deletes any zero at the beginning of the barcode, so we do the same here

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
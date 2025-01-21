import { Routes } from '@angular/router';
import { ChecadorComponent } from './checador/components/checador/checador.component';

export const routes: Routes = [
	{
		path: "checador",
		component: ChecadorComponent
	},
	{
		path: "productos",
		loadComponent: () => import('./productsList/components/productsList/productsList.component')
		.then(m => m.ProductsListComponent)
	},
	{
		path: "**",
		redirectTo: "checador"
	},
];

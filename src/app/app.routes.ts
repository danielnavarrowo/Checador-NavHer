import { Routes } from '@angular/router';
import { ChecadorComponent } from './checador/components/checador/checador.component';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
	{
		path: "checador",
		component: ChecadorComponent,
		canActivate: [authGuard]
	},
	{
		path: "productos",
		loadComponent: () => import('./productsList/components/productsList/productsList.component')
		.then(m => m.ProductsListComponent),
		canActivate: [authGuard]
	},
	{
		path: "login",
		loadComponent: () => import('./login/components/loginPage/loginPage/loginPage.component')
		.then(m => m.LoginPageComponent)
	},
	{
		path: "**",
		redirectTo: "checador"
	},
];

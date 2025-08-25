import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
	{
		path: "checador",
		loadComponent: () => import('./checador/components/checador/checador.component').then(m => m.ChecadorComponent),
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

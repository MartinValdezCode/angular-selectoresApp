import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'paises',
        loadChildren: () => import('./paises/paises.module')
            .then(module => module.PaisesModule)
    },
    {
        path: '**',
        redirectTo: 'paises'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  });

  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: PaisSmall[] = [];

  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap(() => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap(region => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
        this.cargando = false;
      });

    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(() => {
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        //ARREGLAR ESTA VERGA
        switchMap(codigo => this.paisesService.getPaisPorCodigo(codigo)),
        switchMap(pais => this.paisesService.getPaisesPorCodigos(pais))
      )
      .subscribe(paises => {
        this.fronteras = paises.length != 0 
                       ? paises
                       : [];
        console.log(paises);
        this.cargando = false;
      });
  }

  guardar() {
    console.log(this.miFormulario.value);
  }
}

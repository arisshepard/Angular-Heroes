import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { HeroeModel } from '../../models/heroe.model';
import { HeroesService } from '../../services/heroes.service';

import Swal from 'sweetalert2';
// import { info } from 'console';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styleUrls: ['./heroe.component.css'],
})
export class HeroeComponent implements OnInit {
  formulario: FormGroup;
  nombreHeroe = 'Nuevo Héroe';
  // heroe: HeroeModel = new HeroeModel();

  constructor(
    private formBuilder: FormBuilder,
    private heroesService: HeroesService,
    private route: ActivatedRoute
  ) {
    this.crearFormulario();
    this.crearListeners();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id !== 'nuevo') {
      this.heroesService.getHeroe(id).subscribe((respuesta: HeroeModel) => {
        respuesta.id = id;
        this.nombreHeroe = respuesta.nombre;
        this.formulario.setValue(respuesta);
      });
    }
    // console.log(id);
  }

  // guardar(form: NgForm): void {
  //   if (form.invalid) {
  //     console.log('Formulario no válido');
  //   } else {
  //     console.log(form);
  //     console.log(this.heroe);
  //   }
  // }

  campoNoValido(nombreCampo: string): boolean {
    return (
      this.formulario.get(nombreCampo).invalid &&
      this.formulario.get(nombreCampo).touched
    );
  }

  guardar(): void {
    if (this.formulario.invalid) {
      console.log('Formulario no válido');

      return Object.values(this.formulario.controls).forEach((control) => {
        control.markAllAsTouched();
      });
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false,
    });
    Swal.showLoading();

    // nthis.heroe = this.formulario.value;

    let peticion: Observable<any>;

    if (this.formulario.get('id').value) {
      // this.heroesService
      //   .actualizarHeroe(this.formulario.getRawValue())
      //   .subscribe((respuesta) => {
      //     console.log(respuesta);
      //   });

      peticion = this.heroesService.actualizarHeroe(
        this.formulario.getRawValue()
      );
    } else {
      // this.heroesService
      //   .crearHeroe(this.formulario.getRawValue())
      //   .subscribe((heroe: HeroeModel) => {
      //     // this.formulario.get('id').setValue(response.id);
      //     // console.log(this.formulario);
      //     this.formulario.setValue(heroe);

      //     // this.heroe = response;
      //     // console.log(heroe);
      //   });

      peticion = this.heroesService.crearHeroe(this.formulario.getRawValue());
    }

    peticion.subscribe((respuesta: HeroeModel) => {
      if (!this.formulario.get('id').value) {
        this.formulario.setValue(respuesta);
      }
      Swal.fire({
        title: respuesta.nombre,
        text: 'Se actualizó correctamente',
        icon: 'success',
      });
    });

    // console.log(this.formulario.value);

    // this.formulario.reset();
  }

  setHeroeVivo(): void {
    const estaVivo = Boolean(this.formulario.get('vivo')?.value);
    this.formulario.get('vivo').setValue(!estaVivo);
  }

  get heroeVivo(): boolean {
    return Boolean(this.formulario.get('vivo')?.value);
  }

  private crearFormulario(): void {
    this.formulario = this.formBuilder.group({
      id: [''],
      nombre: ['', Validators.required],
      poder: [''],
      vivo: [true],
    });
    this.formulario.controls.id.disable();
  }

  private crearListeners(): void {
    // cualquier valor del formulario
    this.formulario.valueChanges.subscribe((valor) => {
      // this.heroe = valor;
      // console.log(this.heroe);
    });

    // Cualquier cambio en el status
    // this.formulario.statusChanges.subscribe((status) => {
    //   console.log(status);
    // });
    // this.formulario.get('nombre').valueChanges.subscribe((valor) => {
    //   console.log(this.heroe);
    //   this.heroe.nombre = valor;
    // });
  }
}

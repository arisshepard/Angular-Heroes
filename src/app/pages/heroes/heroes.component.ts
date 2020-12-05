import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { HeroeModel } from '../../models/heroe.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  heroes: HeroeModel[] = [];
  cargando = false;

  constructor(private heroesService: HeroesService) {}

  ngOnInit(): void {
    this.cargando = true;
    this.heroesService.getHeroes().subscribe((heroes) => {
      this.heroes = heroes;
      this.cargando = false;
    });
  }

  borrarHeroe(heroe: HeroeModel): void {
    Swal.fire({
      title: 'Borrar héroe',
      text: `¿Está seguro que desea borrar a ${heroe.nombre}?`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
    }).then((respuesta) => {
      if (respuesta.value) {
        const index = this.heroes.indexOf(heroe);
        this.heroesService.borrarHeroe(heroe.id).subscribe(() => {
          this.heroes.splice(index, 1);
        });
      }
    });
  }
}

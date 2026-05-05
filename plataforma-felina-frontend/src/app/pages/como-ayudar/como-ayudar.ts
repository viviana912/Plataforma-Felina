import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-como-ayudar',
  imports: [RouterLink, RevealDirective],
  templateUrl: './como-ayudar.html',
  styleUrl: './como-ayudar.css',
})
export class ComoAyudar {

}

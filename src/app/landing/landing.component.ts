import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
    constructor(private Myservices: ServerService, private router: Router, route: ActivatedRoute) { }
    move(){
      this.router.navigate(["/Home"])
    }
}

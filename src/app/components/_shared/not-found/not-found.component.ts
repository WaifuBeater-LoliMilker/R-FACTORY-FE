import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
  imports: [FontAwesomeModule],
})
export class NotFoundComponent implements OnInit {
  constructor() {}
  faArrowLeft = faArrowLeft;
  ngOnInit() {}
}

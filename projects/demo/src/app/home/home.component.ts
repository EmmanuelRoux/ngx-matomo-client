import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BASE_TITLE } from '../title';
import { MatIcon } from '@angular/material/icon';

@Component({
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIcon],
})
export class HomeComponent implements OnInit {
  private readonly title = inject(Title);

  ngOnInit(): void {
    this.title.setTitle(BASE_TITLE);
  }
}

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BASE_TITLE } from '../title';
import { MatIcon } from '@angular/material/icon';

@Component({
  templateUrl: './home.component.html',
  imports: [MatIcon],
})
export class HomeComponent implements OnInit {
  constructor(private readonly title: Title) {}

  ngOnInit(): void {
    this.title.setTitle(BASE_TITLE);
  }
}

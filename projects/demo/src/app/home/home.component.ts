import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BASE_TITLE } from '../title';

@Component({
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(private readonly title: Title) {}

  ngOnInit(): void {
    this.title.setTitle(BASE_TITLE);
  }
}

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BASE_TITLE } from '../title';

@Component({
  templateUrl: './track-simple-click-event.component.html',
  styleUrls: ['./track-simple-click-event.component.scss'],
})
export class TrackSimpleClickEventComponent implements OnInit {
  category = '';
  action = '';
  name = '';
  value?: number;

  constructor(private readonly title: Title) {}

  ngOnInit(): void {
    this.title.setTitle(BASE_TITLE + ' | Track simple click event');
  }
}

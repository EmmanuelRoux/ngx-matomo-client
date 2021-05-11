import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BASE_TITLE } from '../title';

@Component({
  templateUrl: './track-event-template.component.html',
  styleUrls: ['./track-event-template.component.scss'],
})
export class TrackEventTemplateComponent implements OnInit {
  category = '';
  action = '';
  name = '';
  value?: number;

  constructor(private readonly title: Title) {}

  ngOnInit(): void {
    this.title.setTitle(BASE_TITLE + ' | Track any event (from template)');
  }
}

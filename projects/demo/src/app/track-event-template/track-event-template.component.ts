import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BASE_TITLE } from '../title';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatomoTrackerDirective } from 'ngx-matomo-client';

@Component({
  templateUrl: './track-event-template.component.html',
  styleUrls: ['./track-event-template.component.scss'],
  imports: [MatFormField, MatLabel, MatInput, FormsModule, MatomoTrackerDirective],
})
export class TrackEventTemplateComponent implements OnInit {
  private readonly title = inject(Title);

  category = '';
  action = '';
  name = '';
  value?: number;

  ngOnInit(): void {
    this.title.setTitle(BASE_TITLE + ' | Track any event (from template)');
  }
}

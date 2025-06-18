import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BASE_TITLE } from '../title';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatomoTrackClickDirective } from 'ngx-matomo-client';

@Component({
  templateUrl: './track-simple-click-event.component.html',
  styleUrls: ['./track-simple-click-event.component.scss'],
  imports: [MatFormField, MatLabel, MatInput, FormsModule, MatButton, MatomoTrackClickDirective],
})
export class TrackSimpleClickEventComponent implements OnInit {
  private readonly title = inject(Title);

  category = '';
  action = '';
  name = '';
  value?: number;

  ngOnInit(): void {
    this.title.setTitle(BASE_TITLE + ' | Track simple click event');
  }
}

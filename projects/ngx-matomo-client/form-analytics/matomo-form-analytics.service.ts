import { ElementRef, inject, Injectable } from '@angular/core';
import { ɵInternalMatomoTracker as InternalMatomoTracker } from 'ngx-matomo-client/core';
import { coerceElement } from './utils/coercion';

export interface MatomoFormAnalyticsInstance {
  isFormAnalyticsEnabled(): boolean;

  disableFormAnalytics(): void;

  setTrackingTimer(delayInMilliSeconds: number): void;
}

@Injectable()
export class MatomoFormAnalytics {
  private readonly delegate: InternalMatomoTracker<MatomoFormAnalyticsInstance, 'FormAnalytics::'> =
    inject(InternalMatomoTracker);

  disableFormAnalytics(): void {
    this.delegate.push(['FormAnalytics::disableFormAnalytics']);
  }

  enableFormAnalytics(): void {
    this.delegate.push(['FormAnalytics::enableFormAnalytics']);
  }

  enableDebugMode(): void {
    this.delegate.push(['FormAnalytics::enableDebugMode']);
  }

  setTrackingTimer(delayInMilliSeconds: number): void {
    this.delegate.push(['FormAnalytics::setTrackingTimer', delayInMilliSeconds]);
  }

  scanForForms(root?: Element | ElementRef): void {
    this.delegate.push(['FormAnalytics::scanForForms', coerceElement(root)]);
  }

  trackForm(formElement: Element | ElementRef): void {
    this.delegate.push(['FormAnalytics::trackForm', coerceElement(formElement)]);
  }

  trackFormSubmit(formElement: Element | ElementRef) {
    this.delegate.push(['FormAnalytics::trackFormSubmit', coerceElement(formElement)]);
  }

  trackFormConversion(formElementOrName: Element | ElementRef | string, formId?: string): void {
    this.delegate.push([
      'FormAnalytics::trackFormConversion',
      typeof formElementOrName === 'string' ? formElementOrName : coerceElement(formElementOrName),
      formId,
    ]);
  }

  isFormAnalyticsEnabled(): Promise<boolean> {
    return this.delegate.get('FormAnalytics::isFormAnalyticsEnabled');
  }
}

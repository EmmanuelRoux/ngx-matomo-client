import { Component, LOCALE_ID } from '@angular/core';
import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { By, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  ASYNC_INTERNAL_MATOMO_CONFIGURATION,
  INTERNAL_MATOMO_CONFIGURATION,
  InternalMatomoConfiguration,
  MATOMO_CONFIGURATION,
  MatomoConfiguration,
  MatomoInitializationMode,
} from '../tracker/configuration';
import { MatomoInitializerService } from '../tracker/matomo-initializer.service';
import { MatomoOptOutFormComponent } from './matomo-opt-out-form.component';

@Component({
  selector: 'matomo-host-with-default-server-url-and-locale',
  template: ` <matomo-opt-out-form
    [backgroundColor]="backgroundColor"
    [color]="color"
    [fontSize]="fontSize"
    [fontFamily]="fontFamily"
    [border]="border"
    [width]="width"
    [height]="height"
  ></matomo-opt-out-form>`,
})
class HostWithDefaultServerUrlAndLocaleComponent {
  color = '';
  fontSize = '';
  backgroundColor = '';
  fontFamily = '';
  height = '';
  width = '';
  border = '';
}

@Component({
  selector: 'matomo-host-with-custom-server-url-and-locale',
  template: ` <matomo-opt-out-form
    [backgroundColor]="backgroundColor"
    [color]="color"
    [fontSize]="fontSize"
    [fontFamily]="fontFamily"
    [border]="border"
    [width]="width"
    [height]="height"
    [serverUrl]="serverUrl"
    [locale]="locale"
  ></matomo-opt-out-form>`,
})
class HostWithCustomServerUrlAndLocaleComponent {
  color = '';
  fontSize = '';
  backgroundColor = '';
  fontFamily = '';
  height = '';
  width = '';
  border = '';
  serverUrl: SafeResourceUrl = '';
  locale: string = '';
}

@Component({
  selector: 'matomo-host-without-server-url',
  template: ` <matomo-opt-out-form></matomo-opt-out-form>`,
  providers: [
    {
      provide: INTERNAL_MATOMO_CONFIGURATION,
      useValue: {
        mode: MatomoInitializationMode.MANUAL,
      } as unknown as InternalMatomoConfiguration,
    },
    {
      provide: ASYNC_INTERNAL_MATOMO_CONFIGURATION,
      useValue: Promise.resolve({
        mode: MatomoInitializationMode.MANUAL,
      } as unknown as InternalMatomoConfiguration),
    },
  ],
})
class HostWithoutServerUrlComponent {}

@Component({
  selector: 'matomo-host-without-locale',
  template: ` <matomo-opt-out-form></matomo-opt-out-form>`,
  providers: [
    {
      provide: LOCALE_ID,
      useValue: undefined,
    },
  ],
})
class HostWithoutLocaleComponent {}

describe('MatomoOptOutFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatomoOptOutFormComponent],
      declarations: [
        HostWithDefaultServerUrlAndLocaleComponent,
        HostWithCustomServerUrlAndLocaleComponent,
        HostWithoutServerUrlComponent,
        HostWithoutLocaleComponent,
      ],
      providers: [
        {
          provide: MATOMO_CONFIGURATION,
          useValue: { siteId: 1, trackerUrl: 'http://localhost' } as MatomoConfiguration,
        },
        {
          provide: LOCALE_ID,
          useValue: 'en',
        },
      ],
    }).compileComponents();

    TestBed.inject(MatomoInitializerService).initialize();
  });

  it('should create', async () => {
    const fixture = TestBed.createComponent(HostWithDefaultServerUrlAndLocaleComponent);

    fixture.detectChanges();
    await fixture.whenStable();

    const form = fixture.debugElement.query(By.directive(MatomoOptOutFormComponent));

    expect(form?.componentInstance).toBeTruthy();
    expect(form.query(By.css('iframe'))).toBeTruthy();
  });

  it('should update iframe style', async () => {
    const fixture = TestBed.createComponent(HostWithDefaultServerUrlAndLocaleComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();

    const iframe = fixture.debugElement.query(By.css('iframe'));

    component.width = '100%';
    component.height = '100%';
    component.border = '1px solid red';

    fixture.detectChanges();
    await fixture.whenStable();

    expect(iframe.styles).toEqual(
      jasmine.objectContaining({
        width: '100%',
        height: '100%',
        border: '1px solid red',
      }),
    );
  });

  it('should update iframe src with default server & locale', async () => {
    const fixture = TestBed.createComponent(HostWithDefaultServerUrlAndLocaleComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();

    const iframe = fixture.debugElement.query(By.css('iframe'));

    component.color = 'red';
    component.backgroundColor = 'blue';
    component.fontSize = '10px';
    component.fontFamily = 'Arial';

    fixture.detectChanges();
    await fixture.whenStable();

    expect(iframe.attributes).toEqual(
      jasmine.objectContaining({
        src: 'http://localhost/index.php?module=CoreAdminHome&action=optOut&language=en&backgroundColor=blue&fontColor=red&fontSize=10px&fontFamily=Arial',
      }),
    );
  });

  it('should update iframe src with custom server & locale', async () => {
    const fixture = TestBed.createComponent(HostWithCustomServerUrlAndLocaleComponent);
    const component = fixture.componentInstance;
    const sanitizer = TestBed.inject(DomSanitizer);

    fixture.detectChanges();
    await fixture.whenStable();

    const iframe = fixture.debugElement.query(By.css('iframe'));
    const color = 'red';
    const backgroundColor = 'blue';
    const fontSize = '10px';
    const fontFamily = 'Arial, "Times New Roman", sans-serif';

    component.color = color;
    component.backgroundColor = backgroundColor;
    component.fontSize = fontSize;
    component.fontFamily = fontFamily;
    component.serverUrl = sanitizer.bypassSecurityTrustResourceUrl(
      'https://my.custom.server.url.localhost:42',
    );
    component.locale = 'fr';

    fixture.detectChanges();
    await fixture.whenStable();

    expect(iframe.attributes).toEqual(
      jasmine.objectContaining({
        src:
          'https://my.custom.server.url.localhost:42/index.php?module=CoreAdminHome&action=optOut&language=fr' +
          `&backgroundColor=${encodeURIComponent(backgroundColor)}` +
          `&fontColor=${encodeURIComponent(color)}` +
          `&fontSize=${encodeURIComponent(fontSize)}` +
          `&fontFamily=${encodeURIComponent(fontFamily)}`,
      }),
    );
  });

  it('should throw an error when no server url is available', fakeAsync(() => {
    const fixture = TestBed.createComponent(HostWithoutServerUrlComponent);
    const component = fixture.debugElement.query(By.directive(MatomoOptOutFormComponent))
      ?.componentInstance as MatomoOptOutFormComponent;

    expect(component.serverUrl).toBeFalsy();
    expect(() => {
      fixture.detectChanges();
      flush();
    }).toThrow();
  }));

  it('should not throw an error when no locale is available', () => {
    const fixture = TestBed.createComponent(HostWithoutLocaleComponent);
    const component = fixture.debugElement.query(By.directive(MatomoOptOutFormComponent))
      ?.componentInstance as MatomoOptOutFormComponent;

    expect(component.locale).toEqual('');
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

import { ElementRef } from '@angular/core';

export function coerceElement(elementOrRef: Element | ElementRef<Element>): Element;
export function coerceElement(
  elementOrRef: Element | ElementRef<Element> | null | undefined,
): Element | null | undefined;
export function coerceElement(
  elementOrRef: Element | ElementRef<Element> | null | undefined,
): Element | null | undefined {
  return elementOrRef instanceof ElementRef ? elementOrRef.nativeElement : elementOrRef;
}

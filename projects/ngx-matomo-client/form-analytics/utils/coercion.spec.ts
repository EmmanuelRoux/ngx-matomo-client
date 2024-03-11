import { ElementRef } from '@angular/core';
import { coerceElement } from './coercion';

describe('coercion', () => {
  describe('coerceElement', () => {
    it('should coerce element to itself', () => {
      const element = document.createElement('div');

      expect(coerceElement(element)).toBe(element);
    });

    it('should coerce ElementRef to its native element', () => {
      const element = document.createElement('div');

      expect(coerceElement(new ElementRef(element))).toBe(element);
    });

    it('should coerce null or undefined to itself', () => {
      expect(coerceElement(null)).toBeNull();
      expect(coerceElement(undefined)).toBeUndefined();
    });
  });
});

import { coerceCssSizeBinding, requireNonNull } from './coercion';

describe('coercion', () => {
  describe('requireNonNull', () => {
    it('should throw an error if argument is null or undefined', () => {
      expect(() => requireNonNull(null, 'mycustommessage')).toThrowError(/mycustommessage/);
      expect(() => requireNonNull(undefined, 'mycustommessage')).toThrowError(/mycustommessage/);
      expect(() => requireNonNull('test', 'mycustommessage')).not.toThrow();
      expect(() => requireNonNull('', 'mycustommessage')).not.toThrow();
      expect(() => requireNonNull([], 'mycustommessage')).not.toThrow();
      expect(() => requireNonNull({}, 'mycustommessage')).not.toThrow();
    });
  });

  describe('coerceCssSizeBinding', () => {
    it('should coerce empty values to empty string', () => {
      expect(coerceCssSizeBinding('')).toEqual('');
      expect(coerceCssSizeBinding(undefined)).toEqual('');
      expect(coerceCssSizeBinding(null)).toEqual('');
    });

    it('should coerce number values to pixel string', () => {
      expect(coerceCssSizeBinding(0)).toEqual('0px');
      expect(coerceCssSizeBinding(-2)).toEqual('-2px');
      expect(coerceCssSizeBinding(42)).toEqual('42px');
    });

    it('should return string values as-is, expecting css string', () => {
      expect(coerceCssSizeBinding('0')).toEqual('0');
      expect(coerceCssSizeBinding('-2')).toEqual('-2');
      expect(coerceCssSizeBinding('42')).toEqual('42');
      expect(coerceCssSizeBinding('42%')).toEqual('42%');
    });
  });
});

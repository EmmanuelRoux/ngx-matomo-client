import {requireNonNull} from './coercion';

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

});

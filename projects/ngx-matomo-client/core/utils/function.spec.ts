import { runOnce } from './function';

describe('function', () => {
  describe('runOnce', () => {
    it('should ensure a function is not called more than once, ignoring subsequent calls', () => {
      let count = 0;
      const fn = runOnce(() => count++);

      for (let i = 0; i < 10; i++) {
        fn();
      }

      expect(count).toEqual(1);
    });

    it('should throw an error if a function is called more than once', () => {
      let count = 0;
      const fn = runOnce(() => count++, 'Custom error message');

      expect(() => {
        fn();
        fn();
      }).toThrowError('Custom error message');
      expect(count).toEqual(1);
    });

    it('should call a special handler if a function is called more than once', () => {
      let count = 0;
      let handlerCount = 0;
      const fn = runOnce(
        () => count++,
        () => handlerCount++,
      );

      for (let i = 0; i < 10; i++) {
        fn();
      }

      expect(count).toEqual(1);
      expect(handlerCount).toEqual(9);
    });
  });
});

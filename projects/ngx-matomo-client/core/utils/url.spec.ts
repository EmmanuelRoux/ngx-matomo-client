import { appendTrailingSlash } from './url';

describe('url', () => {
  describe('appendTrailingSlash', () => {
    it('should append trailing slash if not present', () => {
      expect(appendTrailingSlash('')).toEqual('/');
      expect(appendTrailingSlash('/')).toEqual('/');
      expect(appendTrailingSlash('/test')).toEqual('/test/');
      expect(appendTrailingSlash('/test/')).toEqual('/test/');
      expect(appendTrailingSlash('/test/path')).toEqual('/test/path/');
      expect(appendTrailingSlash('/test/path/')).toEqual('/test/path/');
    });
  });
});

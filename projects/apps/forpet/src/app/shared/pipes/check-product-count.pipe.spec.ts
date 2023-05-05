import { CheckProductCountPipe } from './check-product-count.pipe';

describe('CheckProductCountPipe', () => {
  it('create an instance', () => {
    const pipe = new CheckProductCountPipe();
    expect(pipe).toBeTruthy();
  });
});

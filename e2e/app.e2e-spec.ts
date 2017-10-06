import { CryptoinvestorPage } from './app.po';

describe('cryptoinvestor App', () => {
  let page: CryptoinvestorPage;

  beforeEach(() => {
    page = new CryptoinvestorPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});

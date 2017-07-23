import { GamesPage } from './app.po';

describe('games App', () => {
  let page: GamesPage;

  beforeEach(() => {
    page = new GamesPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});

import { browser, by, element } from 'protractor';

/**
 * @ignore
 */
export class AppPage {
  /**
   * @ignore
   */
  async navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl);
  }

  /**
   * @ignore
   */
  async getTitleText(): Promise<string> {
    return element(by.css('app-root .content span')).getText();
  }
}

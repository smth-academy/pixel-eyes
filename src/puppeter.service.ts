import { Injectable } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';

@Injectable()
export class PuppeteerService {
  // TODO: @MarcoDena @Stefanoberka import a services to use a functions for Models
  constructor() { }

  // TODO: @MarcoDena Create a functions to create a new browser instance and snapshooting a page  

  public takeScreenshot(
     url: string,
     width: number = 1920,
     height: number = 1080,
     deviceScaleFactor: number = 1,
  ): Promise<string> {
    let browser: Browser;
    return puppeteer
      .launch({ headless: true })
      .then((b: Browser) => {
        browser = b;
        return browser.newPage();
      })
      .then((page) => {
        return Promise.all([
          page.setViewport({
            width: width,
            height: height,
            deviceScaleFactor: deviceScaleFactor,
          }),
          page.goto(url, { waitUntil: ['networkidle0', 'domcontentloaded'], timeout: 0 }),
          page.waitForSelector('vesta-configurator'),
        ]).then(() => page);
      })
      .then((page) => {
        return page.evaluate(() => {
          const shadowHost = document.querySelector('vesta-configurator');
          const shadowRoot = shadowHost.shadowRoot;
          return shadowRoot.querySelector('canvas')?.toDataURL();
        })
      } 
      )
      .then((result) => {
        const imageData = result.replace(/^data:image\/\w+;base64,/, '');
        require('fs').writeFileSync('screenshot.png', imageData, 'base64');
        return 'Screenshot saved successfully.';
      })
      .catch((err) => {
        console.error(err);
        throw new Error('Error taking screenshot.');
      })
      .finally(() => {
        browser.close();
      });
  }

}

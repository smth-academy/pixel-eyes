import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';
import { writeFileSync } from 'fs';

@Injectable()
export class PuppeteerService {
  private readonly logger = new Logger(PuppeteerService.name);

  public takeScreenshot(
    url: string,
    width = 1920,
    height = 1080,
    deviceScaleFactor = 1,
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
          page.goto(url, {
            waitUntil: ['networkidle0', 'domcontentloaded'],
            timeout: 0,
          }),
          page.waitForSelector('vesta-configurator'),
        ]).then(() => page);
      })
      .then((page) => {
        return page.evaluate(() => {
          const shadowHost = document.querySelector('vesta-configurator');
          const shadowRoot = shadowHost.shadowRoot;
          console.log(shadowRoot);
          return shadowRoot.querySelector('canvas')?.toDataURL();
        });
      })
      .then((result) => {
        console.log(result);

        const imageData = result.replace(/^data:image\/\w+;base64,/, '');
        // Save and rename the image in the selected folder
        writeFileSync('screenshot.png', imageData, 'base64');
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

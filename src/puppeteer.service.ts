import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';
import { writeFileSync } from 'fs';

@Injectable()
export class PuppeteerService {
  private readonly logger = new Logger(PuppeteerService.name);

  // Puppeteer function to make a screenshot in a page
  public takeScreenshot(
    url: string
  ): Promise<string> {
    let browser: Browser;
    return puppeteer
      // Set to show chromium or not and open a new page
      .launch({ headless: true })
      .then((b: Browser) => {
        browser = b;
        return browser.newPage();
      })
      .then((page) => {
        // Go to the url given in input
        return page.goto(url, {
          waitUntil: ['domcontentloaded'],
          timeout: 0,
        }).then(() => {
          // Interact with the page directly in the page DOM environment
          return page.evaluate(() => {
            return new Promise((resolve, reject) => {
              // Wait for the event to load
              document.addEventListener("vesta3dReady", (event) => {
                console.log("VESTA 3D READY", event);
                setTimeout(() => {
                  window['snapshot']((image) => resolve(image.base64))
                }, 2000);
              })
            })
          })
        })
      })

      .then((result: string) => {
        console.log('< Element saved');

        // Save and rename the image in the selected folder
        const imageData = result.replace(/^data:image\/\w+;base64,/, '');
        const path = `./storage/screenshot_${Date.now().valueOf()}.png`;
        writeFileSync(path, imageData, 'base64');
        return path;
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
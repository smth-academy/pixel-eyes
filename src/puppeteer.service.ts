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
      .launch({ headless: false })
      .then((b: Browser) => {
        browser = b;
        return browser.newPage();
      })
      .then((page) => {
        return page.setViewport({
          width: width,
          height: height,
          deviceScaleFactor: deviceScaleFactor,
        }).then(() => {
          return page.goto(url, {
            waitUntil: ['networkidle0', 'domcontentloaded'],
            timeout: 0,
          }).then(() => {
            return page.waitForSelector('div > vesta-configurator').then((page) => {
              console.log("passo1")
              return page.evaluate(() => {
                console.log("ciao")
                const shadowHost = document.querySelector('div > vesta-configurator');
                const shadowRoot = shadowHost.shadowRoot;

                


                return new Promise((resolve, reject) => {
                  window.addEventListener("keypress", (evt) => {
                    console.log('keypress ASDASDSADASDASD', evt)
                    resolve(evt);
                  });
                }).then(() => {
                  const canvas = shadowRoot.querySelector('canvas')
                  console.log('canvas screenshot', canvas)
                  return canvas?.toDataURL();
                })
                
              });
            })
          })
        })
      })
      
      .then((result) => {
        console.log("maroooooooo");
        const imageData = result.replace(/^data:image\/\w+;base64,/, '');
        // Save and rename the image in the selected folder
        writeFileSync(`./storage/screenshot_${Date.now().valueOf()}.png`, imageData, 'base64');
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
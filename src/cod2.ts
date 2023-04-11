import puppeteer, { Browser } from 'puppeteer';


export class Screenshot {
  constructor(
    private url: string,
    private width: number = 1920,
    private height: number = 1080,
    private deviceScaleFactor: number = 1,
  ) { }


  public takeScreenshot(): Promise<string> {
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
            width: this.width,
            height: this.height,
            deviceScaleFactor: this.deviceScaleFactor,
          }),
          page.goto(this.url, { waitUntil: ['networkidle0', 'domcontentloaded'], timeout: 0 }),
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
        require('fs').writeFileSync('screenshots/screenshot.png', imageData, 'base64');
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


const screenshot = new Screenshot(
  'https://viewer.stage.vesta3dmanager.it/?object_id=bottega_veneta&field=external_link'    
);
screenshot
  .takeScreenshot()
  .then((message) => console.log(message))
  .catch((err) => console.error(err));

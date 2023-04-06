"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Screenshot = void 0;
var puppeteer_1 = require("puppeteer");
var Screenshot = /** @class */ (function () {
    function Screenshot(url, width, height, deviceScaleFactor) {
        if (width === void 0) { width = 1920; }
        if (height === void 0) { height = 1080; }
        if (deviceScaleFactor === void 0) { deviceScaleFactor = 1; }
        this.url = url;
        this.width = width;
        this.height = height;
        this.deviceScaleFactor = deviceScaleFactor;
    }
    Screenshot.prototype.takeScreenshot = function () {
        var _this = this;
        var browser;
        return puppeteer_1.default
            .launch({ headless: true })
            .then(function (b) {
            browser = b;
            return browser.newPage();
        })
            .then(function (page) {
            return Promise.all([
                page.setViewport({
                    width: _this.width,
                    height: _this.height,
                    deviceScaleFactor: _this.deviceScaleFactor,
                }),
                page.goto(_this.url, { waitUntil: ['networkidle0', 'domcontentloaded'], timeout: 0 }),
                page.waitForSelector('vesta-configurator'),
            ]).then(function () { return page; });
        })
            .then(function (page) {
            console.log("ciao");
            return page.evaluate(function () {
                var _a;
                var shadowHost = document.querySelector('vesta-configurator');
                var shadowRoot = shadowHost.shadowRoot;
                return (_a = shadowRoot.querySelector('canvas')) === null || _a === void 0 ? void 0 : _a.toDataURL();
            });
        })
            .then(function (result) {
            var imageData = result.replace(/^data:image\/\w+;base64,/, '');
            require('fs').writeFileSync('screenshots/screenshot.png', imageData, 'base64');
            return 'Screenshot saved successfully.';
        })
            .catch(function (err) {
            console.error(err);
            throw new Error('Error taking screenshot.');
        })
            .finally(function () {
            browser.close();
        });
    };
    return Screenshot;
}());
exports.Screenshot = Screenshot;
var screenshot = new Screenshot('https://viewer.stage.vesta3dmanager.it/?object_id=bottega_veneta&field=external_link');
screenshot
    .takeScreenshot()
    .then(function (message) { return console.log(message); })
    .catch(function (err) { return console.error(err); });

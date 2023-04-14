import { Injectable } from '@nestjs/common';
//const fs = require('fs');
import { writeFileSync } from 'fs';
import { readFileSync } from 'fs';
const jimp = require('jimp');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

@Injectable()
export class PixelMatchingService {
  // TODO: @MarcoDena @Stefanoberka import a services to use a functions for Models
  constructor() { }

  public urlToBuffer = async (url) => {
    return new Promise(async (resolve, reject) => {
      await jimp.read(url, async (err, image) => {
        if (err) {
          console.log(`error reading image in jimp: ${err}`);
          reject(err);
        }
        //image.resize(1155, 650); 
        return image.getBuffer(jimp.MIME_PNG, (err, buffer) => {
          if (err) {
            console.log(`error converting image url to buffer: ${err}`);
            reject(err);
          }
          resolve(buffer);
        });
      });
    });
  };

  public compareImage = async (
    url1 = './storage/screenshot_1681462165930.png',
    url2 = './storage/screenshot_1681478810928.png'
  ) => {
    try {
      console.log('> Started comparing two images');
      const img1Buffer = await this.urlToBuffer(url1);
      const img2Buffer = await this.urlToBuffer(url2);
      const img1 = PNG.sync.read(img1Buffer);
      const img2 = PNG.sync.read(img2Buffer);
      const { width, height } = img1;
      const diff = new PNG({ width, height });

      // Comparing two images with pixelmatch and it returns the number of mismatched pixels
      const difference = pixelmatch(
        img1.data,
        img2.data,
        diff.data,
        width,
        height,
        {
          // Matching threshold, ranges from 0 to 1. Smaller values make the comparison more sensitive. 0.1 by default.
          threshold: 0.05,

          // If true, disables detecting and ignoring anti-aliased pixels. false by default.
          includeAA: false,

          // Blending factor of unchanged pixels in the diff output. Ranges from 0 for pure white to 1 for original brightness. 0.1 by default.
          alpha: 0.5,

          // The color of anti-aliased pixels in the diff output in [R, G, B] format. [255, 255, 0] by default.
          aaColor: [255, 255, 0],

          // The color of differing pixels in the diff output in [R, G, B] format. [255, 0, 0] by default.
          diffColor: [255, 0, 0],

          // An alternative color to use for dark on light differences to differentiate between "added" and "removed" parts.
          // If not provided, all differing pixels use the color specified by diffColor. null by default.
          diffColorAlt: [255, 0, 255]
        }
      );

      // Function to calculate the MSE (Mean Squared Error)
      const a = img1.data;
      const b = img2.data;
      function mse(a, b) {
        let error = 0
        for (let i = 0; i < a.length; i++) {
          error += Math.pow((b[i] - a[i]), 2)
        }
        return error / a.length
      }

      // Save and rename the image with the differences in the selected folder
      const path_image = `./storage/diffed_images/diff_${Date.now().valueOf()}.png`;
      writeFileSync(path_image, PNG.sync.write(diff));

      // Calculations on the diff image
      const diffImage = PNG.sync.read(readFileSync(path_image));
      const totalPixels = diffImage.width * diffImage.height;
      let numRedPixels = 0;
      for (let i = 0; i < diffImage.data.length; i += 4) {
        if (diffImage.data[i] === 255 && diffImage.data[i + 1] === 0 && diffImage.data[i + 2] === 0) {
          numRedPixels++;
        }
      }
      const diffRatio = numRedPixels / totalPixels * 100;
      const compatibility = 100 - (difference * 100) / (width * height);

      // Console output
      console.log('MSE value (Mean Squared Error):', mse(img1.data, img2.data).toFixed(7));
      console.log('Red pixels in the diffed image:', diffRatio.toFixed(2), '%');
      console.log(`Number of mismatched pixels: ${difference}/${totalPixels}`);
      //console.log(`Similarity between the two images: ${compatibility.toFixed(4)} %`);
      console.log('< Completed comparing two images');
      return compatibility;

    } catch (error) {
      console.log(`error comparing images: ${error}`);
      throw error;
    }
  }; 
}

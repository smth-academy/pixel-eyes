import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { readFileSync } from 'fs';
const jimp = require('jimp');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

@Injectable()
export class PixelMatchingService {
  private readonly logger = new Logger(PixelMatchingService.name);
  constructor() { }

  public urlToBuffer = async (url) => {
    return new Promise(async (resolve, reject) => {
      await jimp.read(url, async (err, image) => {
        if (err) {
          this.logger.error(`error reading image in jimp: ${err}`);
          reject(err);
        }
        // Here you can decide the size of output image
        //image.resize(1920, 1080);

        return image.getBuffer(jimp.MIME_PNG, (err, buffer) => {
          if (err) {
            this.logger.error(`error converting image url to buffer: ${err}`);
            reject(err);
          }
          resolve(buffer);
        });
      });
    });
  };

  // Function of pixelmatch to compare images
  public compareImage = async (
    url1,
    url2
  ) => {
    try {
      this.logger.log('> Started comparing two images');
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
      function mse(a, b) {
        let error = 0
        for (let i = 0; i < a.length; i++) {
          error += Math.pow((b[i] - a[i]), 2)

        }
        return error / a.length
      }

      // Save and rename the image with the differences in the selected folder
      const path_image = `./storage/diffed_images/diff_${Date.now().valueOf()}_${width}x${height}.png`
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
      let numPurplePixels = 0;
      for (let i = 0; i < diffImage.data.length; i += 4) {
        if (diffImage.data[i] === 255 && diffImage.data[i + 1] === 0 && diffImage.data[i + 2] === 255) {
          numPurplePixels++;
        }
      }
      let numYellowPixels = 0;
      for (let i = 0; i < diffImage.data.length; i += 4) {
        if (diffImage.data[i] === 255 && diffImage.data[i + 1] === 255 && diffImage.data[i + 2] === 0) {
          numYellowPixels++;
        }
      }
      const diffRatioR = numRedPixels / totalPixels * 100;
      const diffRatioP = numPurplePixels / totalPixels * 100;
      const diffRatioY = numYellowPixels / totalPixels * 100;
      const compatibility = 100 - (difference * 100) / (width * height);
      const mseValue = mse(img1.data, img2.data);
      const redPixels = diffRatioR;
      const purplePixels = diffRatioP;
      const yellowPixels = diffRatioY;
      const misPixels = difference;

      // Console output
      this.logger.log(`${width}x${height} Image resolution`);
      this.logger.log(`${mseValue} MSE value (Mean Squared Error)`);
      this.logger.log(`${compatibility} %  Similarity between the two images`);
      this.logger.log(`${redPixels} %  Percent of mismatched pixels (Red)`);
      this.logger.log(`${purplePixels} %  Percent of dark on light differences (Purple)`);
      this.logger.log(`${yellowPixels} %  Percent of anti-aliased pixels (Yellow)`);
      this.logger.log(`${totalPixels} Number of total pixels`);
      this.logger.log(`${misPixels} Number of mismatched pixels`);
      this.logger.log('< Completed comparing two images');
      return {
        imgPath: path_image,
        width: width,
        height: height,
        mse: mseValue,
        compt: compatibility,
        redPixels: redPixels,
        purplePixels: purplePixels,
        yellowPixels: yellowPixels,
        totPixels: totalPixels,
        misPixels: misPixels,
      };

    } catch (error) {
      this.logger.error(`error comparing images: ${error}`);
      throw error;
    }
  };
}
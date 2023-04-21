/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '@nestjs/common';
import { Command, CommandRunner, Option } from 'nest-commander';
import { DiffedsService } from './models/diffed/diffed.service';
import { DiffersService } from './models/differ/differ.service';
import { SamplersService } from './models/sampler/sampler.service';
import { PixelMatchingService } from './pixelmatching.service';
import { PuppeteerService } from './puppeteer.service';
import { from } from 'rxjs';
import { Sampler } from './models/sampler/sampler.model';
import { Differ } from './models/differ/differ.model';
import { Diffed } from './models/diffed/diffed.model';

// Command definition
@Command({
  name: 'pixeleyes',
  description: 'Compares two images and returns an image and its relative data',
})
// BasicCommand class definition
export class BasicCommand extends CommandRunner {
  private readonly logger = new Logger(BasicCommand.name);

  constructor(
    private readonly diffedsService: DiffedsService,
    private readonly differsService: DiffersService,
    private readonly samplersService: SamplersService,
    private readonly puppeteerService: PuppeteerService,
    private readonly pixelMatchingService: PixelMatchingService,
  ) {
    super();
  }
  // The options parameter refers to the options passed in by the user and defined below
  async run(passedParam: string[], options?: any): Promise<any> {
    // Check if the user has passed the URL
    const url = passedParam[0];

    if (!url) {
      this.logger.error('Missing url in param');
      return;
    }
    this.logger.log(`> Url entered:  ${url}`);

    // Check if the input is a valid vesta url
    // if (!(url.indexOf("vesta3dmanager") > -1 && url.indexOf("viewer") > -1)) {
    //   this.logger.error('This url is not from Vesta!')
    //   return;
    // }

    // Put all the options in const
    const verbose = options.verbose;
    const override = options.override;
    const headless = options.headless;
    const antialiasing = options.antialiasing;
    const list = options.list;
    const threshold = options.threshold;
    const alpha = options.alpha;

    // List option implementation
    if (list) {
      const amt = passedParam[1]
      const listNum = +amt
      const records = await this.diffedsService.findAll(listNum);
      const dataValues = records.map((diffed) => diffed.dataValues);
      console.log(dataValues);
      return;
    }

    if (override) {
      return this.puppeteerService
      // Takes the screenshot to the passed URL
      .takeScreenshot(url)
      // Looks for if the image is already in DB
      .then((pathImage: string) => {
        return this.samplersService.findOne(url).then((sampler: Sampler) => {
          return {
            sampler: sampler,
            pathImage: pathImage
          }
        });
      }).then((result: { sampler: Sampler, pathImage: string }) => {
        return this.samplersService.update(url, {
          imgPath: result.pathImage,
          url: url
        })
      })
      
    } else {

    // Calling the puppeteer service
    return this.puppeteerService
      // Takes the screenshot to the passed URL
      .takeScreenshot(url)
      // Looks for if the image is already in DB
      .then((pathImage: string) => {
        return this.samplersService.findOne(url).then((sampler: Sampler) => {
          return {
            sampler: sampler,
            pathImage: pathImage
          }
        });
      })
      // Override option implementation
      .then((result: { sampler: Sampler, pathImage: string }) => {
        let res = null;
        // If there is no img in DB, save the image as sampler
        if (!result.sampler) {
          res = this.samplersService.create({
            imgPath: result.pathImage,
            url: url
          }).then((sampler: Sampler) => {
            return {
              object: sampler,
              type: 'sampler'
            }
          });
          this.logger.log("Sampler saved, insert new url to make a comparison.")
          // If there already is an image in DB, save the image as differ
        } else {
          res = this.differsService.create({
            imgPath: result.pathImage,
            url: url
          }).then((differ: Differ) => {
            return {
              object: differ,
              sampler: result.sampler,
              type: 'differ'
            }
          });
          return res;
        }
      })
      // Create the object to be either sampler or differ:
      // If sampler the program exits, if differ passes to pixelmatch
      .then((result: { object: Sampler | Differ, type: string, sampler?: Sampler }) => {
        if (result.type === 'sampler') {
          return void 0;
        } else {
          // Calling the pixelmatch service and compare the sampler and the differ
          return this.pixelMatchingService.compareImage(result.sampler.imgPath, result.object.imgPath)
            // Declare the output values to be saved in DB
            .then((result: {
              imgPath: string,
              width: number,
              height: number,
              mse: number,
              compt: number,
              redPixels: number,
              purplePixels: number,
              yellowPixels: number,
              misPixels: number,
              totPixels: number,
            }) => {
              // Query to create a row with the output values
              return this.diffedsService.create({
                imgPath: result.imgPath,
                width: result.width,
                height: result.height,
                mse: result.mse,
                compt: result.compt,
                redPixels: result.redPixels,
                purplePixels: result.purplePixels,
                yellowPixels: result.yellowPixels,
                misPixels: result.misPixels,
                totPixels: result.totPixels,

              })
            })
        }
      })
      .finally(() => {
        this.logger.log('Mission completed!')
      })
    }
  }

  @Option({
    flags: '-v, --verbose',
    description: 'Increase verbosity',
  })
  parseVerbose(val) {
    return val;
  }

  @Option({
    flags: '-o, --override',
    description: 'Overrides the current sampler image',
  })
  parseOverride(val) {
    return val;
  }

  @Option({
    flags: '-H, --headless',
    description: 'Enable headless mode',
  })
  parseHeadless(val) {
    return val;
  }

  @Option({
    flags: '-a, --antialiasing',
    description: 'Show antialiasing',
  })
  parseAntialiasing(val) {
    return val;
  }

  @Option({
    flags: '-l, --list',
    description: 'Lists the last n compared images',
  })
  parseList(val: string) {
    return val;
  }

  @Option({
    flags: '-t, --threshold <float>',
    description: 'Sets the treshold for the compare between 0 and 1',
  })
  parseTreshold(val: string): number {
    return Number(val);
  }

  @Option({
    flags: '-A, --alpha <float>',
    description: 'Sets the value for the alpha between 0 and 1',
  })
  parseAlpha(val: string): number {
    return Number(val);
  }
}

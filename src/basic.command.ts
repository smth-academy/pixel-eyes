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

@Command({
  name: 'pixeleyes',
  description:
    'Compares two images and returns an image and its relative data',
})
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
  // The options parameter refers to the actual options
  run(passedParam: string[], options?: any): Promise<any> {
    const url = passedParam[0];
    if (!url) {
      this.logger.error('Missing url in param');
      return;
    }
    this.logger.log(`> Url entered:  ${url}`);

    const verbose = !!options.verbose;

    return this.puppeteerService
      .takeScreenshot(url)
      .then((pathImage: string) => {
        return this.samplersService.findOne(url).then((sampler: Sampler) => {
          return {
            sampler: sampler,
            pathImage: pathImage
          }
        });
      })
      .then((result: { sampler: Sampler, pathImage: string }) => {
        let res = null;
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
      .then((result: { object: Sampler | Differ, type: string, sampler?: Sampler }) => {
        if (result.type === 'sampler') {
          return void 0;
        } else {
          return this.pixelMatchingService.compareImage(result.sampler.imgPath, result.object.imgPath)
            .then((result: {
              mse: number,
              redPixels: number,
              purplePixels: number,
              yellowPixels: number,
              totPixels: number,
              misPixels: number,
              imgPath: string,
              compt: number,
            }) => {
              return this.diffedsService.create({
                imgPath: result.imgPath,
                mse: result.mse,
                redPixels: result.redPixels,
                purplePixels: result.purplePixels,
                yellowPixels: result.yellowPixels,
                totPixels: result.totPixels,
                misPixels: result.misPixels,
                compt: result.compt,
              })
            })
        }
      })
      .finally(() => {
        this.logger.log('Mission completed!')
      })
  }

  @Option({
    flags: '-v, --verbose',
    description: 'Increase verbosity',
  })
  @Option({
    flags: '-o, --override',
    description: 'Overrides the current sampler image',
  })
  @Option({
    flags: '-H, --headless',
    description: 'Enable headless mode',
  })
  @Option({
    flags: '-a, --antialiasing <true | false>',
    description: 'Show antialiasing',
  })
  @Option({
    flags: '-l, --list <int>',
    description: 'Lists the last n compared images',
  })
  parseList(val: string): number {
    return Number(val);
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
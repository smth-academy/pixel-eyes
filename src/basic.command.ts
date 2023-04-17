import { Logger } from '@nestjs/common';
import { Command, CommandRunner, Option } from 'nest-commander';
import { DiffedsService } from './models/diffed/diffed.service';
import { DiffersService } from './models/differ/differ.service';
import { SamplersService } from './models/sampler/sampler.service';
import { PixelMatchingService } from './pixelmatching.service';
import { PuppeteerService } from './puppeteer.service';
import { from } from 'rxjs';

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
    this.logger.log('Example command log');

    const url = passedParam[0];
    if (!url) {
      this.logger.error('Missing url in param');
      return;
    }
    console.log('> Url entered: ', url);

    const verbose = !!options.verbose;

    return this.puppeteerService
      .takeScreenshot(url)
      .then((pathImage: string) => {
        this.logger.verbose(`screenshot image: ${pathImage}`);
        this.pixelMatchingService.compareImage('./storage/suzanne_giusta.png', pathImage);
        return pathImage;
      }).finally(() => {
        this.logger.verbose('Mission completed!')
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
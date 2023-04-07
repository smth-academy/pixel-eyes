import { Logger } from '@nestjs/common';
import { Command, CommandRunner, Option } from 'nest-commander';
import { DiffedsService } from './models/diffed/diffed.service';
import { DiffersService } from './models/differ/differ.service';
import { SamplersService } from './models/sampler/sampler.service';
import { PuppeteerService } from './puppeteer.service';
import { PixelMatchingService } from './pixelmatching.service';

@Command({
  name: 'pixeleyes',
  description:
    'Compares two images and returns and image and its relative data',
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
  async run(passedParam: string[], options?: any): Promise<any> {
    this.logger.log('Example command log');
    // Overrides sampler in database
    if (!!options.override) {
      const a = this.samplersService.getHello(options);
      this.logger.log(a);
    } else {
      this.logger.log('nooption');
    }
  }

  @Option({
    flags: '-v, --verbose',
    description: 'Increase verbosity',
  })
  parseVerbose(val: string): string {
    return val;
  }
  @Option({
    flags: '-o, --override',
    description: 'Overrides the current sampler image',
  })
  parseOverride(val: string): string {
    return val;
  }
  @Option({
    flags: '-H, --headless',
    description: 'Sets the headless mode',
  })
  parseHeadless(val: string): string {
    return val;
  }
  @Option({
    flags: '-a, --antialiasing',
    description: 'Select antialiasing mode',
  })
  parseAntialiasing(val: string): string {
    return val;
  }
  @Option({
    flags: '-l, --list <int>',
    description: 'Lists the last n compared images',
  })
  parseList(val: string): number {
    return Number(val);
  }
  @Option({
    flags: '-t, --treshold <float>',
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

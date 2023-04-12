import { Logger } from '@nestjs/common';
import { Command, CommandRunner, Option } from 'nest-commander';
import { Sequelize } from 'sequelize-typescript';
import { DiffedsService } from './models/diffed/diffed.service';
import { DiffersService } from './models/differ/differ.service';
import { SamplersService } from './models/sampler/sampler.service';
import { PuppeteerService } from './puppeter.service';
import { PixelMatchingService } from './pixelmatching.service';

@Command({ name: 'pixeleyes', description: 'TODO CREATE A DESCRIPTION' })
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

  async run(passedParam: string[], options?: any): Promise<any> {
    this.logger.log('Example command log');
    this.logger.error('IMPLEMENTS A COMMAND');
    //this.puppeteerService.takeScreenshot('https://viewer.stage.vesta3dmanager.it/?object_id=bottega_veneta&field=external_link')
    //.then((message) => console.log(message))
    //.catch((err) => console.error(err));
    this.pixelMatchingService.compareImage('https://smth-test-space.fra1.digitaloceanspaces.com/image-matching%2FImmagine%202023-03-20%20151136.png',
      'https://smth-test-space.fra1.digitaloceanspaces.com/image-matching%2FImmagine%202023-03-20%20151158.png')
  }
}

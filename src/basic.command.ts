import { Logger } from '@nestjs/common';
import { Command, CommandRunner, Option } from 'nest-commander';
import { Sequelize } from 'sequelize-typescript';
import { SamplersService } from './models/sampler/sampler.service';

@Command({ name: 'basic', description: 'A parameter parse' })
export class BasicCommand extends CommandRunner {
  private readonly logger = new Logger(BasicCommand.name);

  constructor(private readonly samplersService: SamplersService) {
    super();
  }

  async run(passedParam: string[], options?: any): Promise<any> {
    this.logger.log('Basic command run');

    await this.samplersService.create();
    const a = await this.samplersService.findAll();
    const b = a.map((x) => x.name);
    this.logger.log(b);
  }
}

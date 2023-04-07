import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BasicCommand } from './basic.command';

import { Diffed } from './models/diffed/diffed.model';
import { DiffedsService } from './models/diffed/diffed.service';
import { Differ } from './models/differ/differ.model';
import { DiffersService } from './models/differ/differ.service';
import { Sampler } from './models/sampler/sampler.model';
import { SamplersService } from './models/sampler/sampler.service';
import { PuppeteerService } from './puppeteer.service';
import { PixelMatchingService } from './pixelmatching.service';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: './db.sqlite',
      autoLoadModels: true,
      synchronize: true,
      models: [Sampler, Differ, Diffed],
    }),

    SequelizeModule.forFeature([Sampler, Differ, Diffed]),
  ],
  providers: [
    DiffedsService,
    DiffersService,
    SamplersService,
    PuppeteerService,
    PixelMatchingService,
    BasicCommand,
  ],
  exports: [SequelizeModule],
})
export class AppModule {}

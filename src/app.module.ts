import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BasicCommand } from './basic.command';
import { Sampler } from './models/sampler/sampler.model';
import { SamplersService } from './models/sampler/sampler.service';
import { Diffed } from './models/diffed/diffed.model';
import { Differ } from './models/differ/differ.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: './db.sqlite',
      autoLoadModels: false,
      synchronize: false,
      // Declare the model 'Sampler'
      models: [Sampler, Differ, Diffed],
    }),

    SequelizeModule.forFeature([Sampler]),
  ],
  providers: [SamplersService, BasicCommand],
  exports: [SequelizeModule],
})
export class AppModule {}

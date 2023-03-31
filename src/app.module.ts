import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BasicCommand } from './basic.command';
import { Sampler } from './models/sampler/sampler.model';
import { SamplersService } from './models/sampler/sampler.service';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: './db.sqlite',
      autoLoadModels: true,
      synchronize: true,
      models: [Sampler],
    }),

    SequelizeModule.forFeature([Sampler]),
  ],
  providers: [SamplersService, BasicCommand],
  exports: [SequelizeModule],
})
export class AppModule {}

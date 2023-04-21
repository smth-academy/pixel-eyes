import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sampler } from './sampler.model';
import { SamplerCreationAttributes } from './sampler.interface';

@Injectable()
export class SamplersService {
  constructor(
    // Init the sampler model to use in functions
    @InjectModel(Sampler)
    private samplerModel: typeof Sampler,
  ) { }

  async create(input: SamplerCreationAttributes): Promise<Sampler> {
    return this.samplerModel.create(input);
  }

  findOne(url: string): Promise<Sampler> {
    return this.samplerModel.findOne({
      where: {
        url: url,
      },
    });
  }

  update(url: string, param: SamplerCreationAttributes): Promise<Sampler> {
    return this.samplerModel.update(
      param,
      {
        where: {
          url: url,
        },
        returning: true
      }).then((result) => result[1][0]);
  }
}
